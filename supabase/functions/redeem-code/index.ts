import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DEFAULT_ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/([a-z0-9-]+\.)*academiamarianabarros\.com(\.br)?$/i,
  /^https:\/\/([a-z0-9-]+\.)*marianabarros\.[a-z.]+$/i,
  /^https:\/\/[a-z0-9-]+\.pages\.dev$/i,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i,
  /^https:\/\/[a-z0-9-]+\.netlify\.app$/i,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i,
];

function getCorsHeaders(req: Request): Record<string, string> {
  const configured = (Deno.env.get('ALLOWED_ORIGIN') || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const reqOrigin = req.headers.get('origin') || '';
  const isAllowed =
    configured.length > 0
      ? configured.includes(reqOrigin)
      : DEFAULT_ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(reqOrigin));

  return {
    'Access-Control-Allow-Origin': isAllowed ? reqOrigin : (configured[0] || 'null'),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido.' }), {
      headers: jsonHeaders,
      status: 405,
    });
  }

  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token) {
      return new Response(JSON.stringify({ error: 'Faça login para continuar.' }), {
        headers: jsonHeaders,
        status: 401,
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: 'Configuração incompleta do servidor.' }), {
        headers: jsonHeaders,
        status: 500,
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: userData, error: authErr } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Sessão inválida ou expirada.' }), {
        headers: jsonHeaders,
        status: 401,
      });
    }

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'JSON inválido.' }), {
        headers: jsonHeaders,
        status: 400,
      });
    }

    if (body.action === 'get_community_link') {
      const [{ data: profile }, { data: purchases }] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('premium_features, acesso_combo_ouro')
          .eq('id', user.id)
          .maybeSingle(),
        supabase.from('compras_utilizadores').select('modulo_comprado, status').eq('user_id', user.id),
      ]);

      const activePurchases = Array.isArray(purchases)
        ? purchases.filter((p) => !p.status || p.status === 'active').map((p) => p.modulo_comprado)
        : [];
      const unlocked = new Set<string>([
        ...(Array.isArray(profile?.premium_features) ? profile.premium_features : []),
        ...activePurchases,
      ]);

      const hasCommunity =
        unlocked.has('comunidade') ||
        unlocked.has('comunidade_vip') ||
        unlocked.has('pacote_elite') ||
        unlocked.has('total_vip');

      if (!hasCommunity) {
        return new Response(JSON.stringify({ error: 'Acesso à Comunidade VIP não ativo nesta conta.' }), {
          headers: jsonHeaders,
          status: 403,
        });
      }

      const communityUrl = Deno.env.get('TELEGRAM_VIP_URL') || 'https://t.me/+KiOxeuwQ8a40ZWM8';
      return new Response(JSON.stringify({ url: communityUrl }), {
        headers: jsonHeaders,
        status: 200,
      });
    }

    const rawCode = typeof body.code === 'string' ? body.code : '';
    const normalized = rawCode.replace(/\s+/g, '').toUpperCase();
    if (!normalized || normalized.length > 64) {
      return new Response(JSON.stringify({ error: 'Digite um código válido.' }), {
        headers: jsonHeaders,
        status: 400,
      });
    }

    const { data: promo, error: promoErr } = await supabase
      .from('promo_codes')
      .select('code, modules, max_uses, current_uses, expires_at, is_active')
      .eq('code', normalized)
      .maybeSingle();

    if (promoErr) {
      console.error('Error querying promo_codes:', promoErr);
      return new Response(JSON.stringify({ error: 'Erro ao validar código. Tente novamente.' }), {
        headers: jsonHeaders,
        status: 500,
      });
    }

    if (!promo || !promo.is_active) {
      return new Response(
        JSON.stringify({ error: 'Código inválido ou expirado. Verifique o e-mail da Hotmart.' }),
        { headers: jsonHeaders, status: 404 }
      );
    }

    if (promo.expires_at && new Date(promo.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: 'Este código já expirou.' }), {
        headers: jsonHeaders,
        status: 410,
      });
    }

    if (typeof promo.max_uses === 'number' && promo.current_uses >= promo.max_uses) {
      return new Response(JSON.stringify({ error: 'Limite de usos deste código atingido.' }), {
        headers: jsonHeaders,
        status: 410,
      });
    }

    const modulesToGrant: string[] = Array.isArray(promo.modules) ? promo.modules.filter(Boolean) : [];
    if (modulesToGrant.length === 0) {
      return new Response(JSON.stringify({ error: 'Código sem módulos configurados.' }), {
        headers: jsonHeaders,
        status: 400,
      });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('has_base_access, premium_features, acesso_combo_ouro, assinatura_scanner_ia_ativa')
      .eq('id', user.id)
      .maybeSingle();

    const currentFeatures = new Set<string>(Array.isArray(profile?.premium_features) ? profile.premium_features : []);
    for (const mod of modulesToGrant) {
      currentFeatures.add(mod);
    }
    const updatedFeatures = Array.from(currentFeatures);
    const hasGold = Boolean(profile?.acesso_combo_ouro) || updatedFeatures.includes('vip_gold') || updatedFeatures.includes('total_vip');
    const hasScanner =
      Boolean(profile?.assinatura_scanner_ia_ativa) ||
      hasGold ||
      updatedFeatures.includes('scanner_ia') ||
      updatedFeatures.includes('pacote_elite') ||
      updatedFeatures.includes('arsenal_premium');
    const hasBase = Boolean(profile?.has_base_access) || hasGold;

    const rows = modulesToGrant.map((mod) => ({
      user_id: user.id,
      modulo_comprado: mod,
      hotmart_transaction: `PROMO:${promo.code}`,
      status: 'active',
    }));

    const { error: upsertErr } = await supabase
      .from('compras_utilizadores')
      .upsert(rows, { onConflict: 'user_id,modulo_comprado' });

    if (upsertErr) {
      console.error('Error upserting compras_utilizadores:', upsertErr);
      return new Response(JSON.stringify({ error: 'Erro ao registrar desbloqueio.' }), {
        headers: jsonHeaders,
        status: 500,
      });
    }

    const { error: profileErr } = await supabase
      .from('user_profiles')
      .update({
        has_base_access: hasBase,
        premium_features: updatedFeatures,
        acesso_combo_ouro: hasGold,
        assinatura_scanner_ia_ativa: hasScanner,
      })
      .eq('id', user.id);

    if (profileErr) {
      console.error('Error updating user_profiles in redeem-code:', profileErr);
      return new Response(JSON.stringify({ error: 'Erro ao atualizar perfil.' }), {
        headers: jsonHeaders,
        status: 500,
      });
    }

    await supabase
      .from('promo_codes')
      .update({ current_uses: (promo.current_uses || 0) + 1 })
      .eq('code', promo.code);

    return new Response(
      JSON.stringify({
        success: true,
        code: promo.code,
        unlockedModules: modulesToGrant,
        premium_features: updatedFeatures,
        acesso_combo_ouro: hasGold,
        assinatura_scanner_ia_ativa: hasScanner,
        has_base_access: hasBase,
      }),
      { headers: jsonHeaders, status: 200 }
    );
  } catch (err) {
    console.error('Unexpected error in redeem-code:', err);
    return new Response(JSON.stringify({ error: 'Erro interno ao ativar código.' }), {
      headers: jsonHeaders,
      status: 500,
    });
  }
});
