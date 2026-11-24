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
      return new Response(JSON.stringify({ error: 'Não autorizado.' }), {
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

    const tables = [
      'treinos_guardados',
      'workout_logs',
      'evolucao_corporal',
      'nutrition_logs',
      'registos_hidratacao',
      'registos_sono',
      'compras_utilizadores',
      'nutriscan_upsell_events',
      'ai_usage_logs',
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq('user_id', user.id);
      if (error) console.error(`Error deleting data from ${table}:`, error);
    }

    await supabase.from('ranking_global').delete().eq('id', user.id);
    await supabase.from('profiles_public').delete().eq('id', user.id);
    await supabase.from('user_profiles').delete().eq('id', user.id);

    const { error: deleteAuthErr } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteAuthErr) {
      console.error('Error deleting user from Auth:', deleteAuthErr);
      return new Response(JSON.stringify({ error: 'Não foi possível concluir a exclusão da conta.' }), {
        headers: jsonHeaders,
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'Conta e dados pessoais excluídos permanentemente.' }), {
      headers: jsonHeaders,
      status: 200,
    });
  } catch (err) {
    console.error('Unexpected error in delete-account:', err);
    return new Response(JSON.stringify({ error: 'Erro interno ao excluir a conta.' }), {
      headers: jsonHeaders,
      status: 500,
    });
  }
});
