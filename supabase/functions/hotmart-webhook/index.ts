import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MAX_BODY_BYTES = 64 * 1024;

const DEFAULT_PRODUCT_MAP: Record<string, { base?: boolean; modules: string[] }> = {
  O106106388F: { base: true, modules: ['vip_gold', 'desafio_30', 'sono', 'pilates', 'gymnastics', 'senior', 'musculacao'] },
  I105940414O: { modules: ['pacote_elite', 'scanner_ia', 'comunidade'] },
  E105939718I: { base: true, modules: ['total_vip', 'vip_gold', 'pacote_elite', 'scanner_ia', 'desafio_30', 'sono', 'comunidade', 'pilates', 'gymnastics', 'senior', 'musculacao'] },
  N105939399C: { modules: ['musculacao'] },
  H106107115U: { modules: ['scanner_ia'] },
  R106106925S: { modules: ['desafio_30'] },
  B105940293A: { modules: ['comunidade'] },
  Y106107162P: { modules: ['sono'] },
  D105938993C: { modules: ['recuperacao_ativa'] },
  M105939209K: { modules: ['mini_bands'] },
  E105938855Y: { modules: ['pilates'] },
};

const GRANT_EVENTS = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']);
const REVOKE_EVENTS = new Set([
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_CANCELED',
  'SUBSCRIPTION_CANCELLATION',
  'PURCHASE_EXPIRED',
]);
const IGNORED_EVENTS = new Set([
  'PURCHASE_BILLET_PRINTED',
  'PURCHASE_DELAYED',
  'PURCHASE_PROTEST',
  'PURCHASE_OUT_OF_SHOPPING_CART',
  'WAITING_PAYMENT',
]);

function constantTimeEquals(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
}

function getProductMap(): Record<string, { base?: boolean; modules: string[] }> {
  const raw = Deno.env.get('HOTMART_PRODUCT_MAP');
  if (!raw) return DEFAULT_PRODUCT_MAP;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...DEFAULT_PRODUCT_MAP, ...parsed };
    }
  } catch {
    console.error('HOTMART_PRODUCT_MAP is not valid JSON.');
  }
  return DEFAULT_PRODUCT_MAP;
}

function jsonRes(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return jsonRes({ error: 'Método não permitido.' }, 405);
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonRes({ error: 'Content-Type deve ser application/json.' }, 415);
  }

  const validHottoks = (Deno.env.get('HOTMART_HOTTOK') || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  if (validHottoks.length === 0) {
    console.error('HOTMART_HOTTOK not configured.');
    return jsonRes({ error: 'Configuração incompleta do servidor.' }, 500);
  }

  const receivedHottok = req.headers.get('x-hotmart-hottok') || req.headers.get('hottok') || '';
  if (!receivedHottok || !validHottoks.some((secret) => constantTimeEquals(receivedHottok, secret))) {
    return jsonRes({ error: 'Não autorizado.' }, 401);
  }

  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return jsonRes({ error: 'Payload muito grande.' }, 413);
  }

  let payload: Record<string, any>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonRes({ error: 'JSON inválido.' }, 400);
  }

  const eventType = typeof payload?.event === 'string' ? payload.event.trim().toUpperCase() : '';
  const rawEmail = payload?.data?.buyer?.email;
  const rawProductId = payload?.data?.product?.id;
  const rawOfferCode = payload?.data?.purchase?.offer?.code;
  const transactionId = typeof payload?.data?.purchase?.transaction === 'string'
    ? payload.data.purchase.transaction.trim()
    : '';
  const eventId = typeof payload?.id === 'string' && payload.id.trim()
    ? payload.id.trim()
    : `${eventType}:${transactionId}:${payload?.creation_date || Date.now()}`;
  const eventCreatedAt = payload?.creation_date
    ? new Date(Number(payload.creation_date)).toISOString()
    : new Date().toISOString();

  if (IGNORED_EVENTS.has(eventType)) {
    return jsonRes({ message: 'Evento não final ignorado sem modificar acessos.' }, 200);
  }

  const isGrant = GRANT_EVENTS.has(eventType);
  const isRevoke = REVOKE_EVENTS.has(eventType);
  if (!isGrant && !isRevoke) {
    return jsonRes({ message: 'Tipo de evento não aplicável.' }, 200);
  }

  if (typeof rawEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(rawEmail.trim())) {
    return jsonRes({ error: 'E-mail inválido ou ausente.' }, 400);
  }
  const email = rawEmail.trim().toLowerCase();

  const productKey = rawProductId != null ? String(rawProductId).trim() : '';
  const offerKey = typeof rawOfferCode === 'string' ? rawOfferCode.trim() : '';
  const productMap = getProductMap();
  const mapping = productMap[productKey] || productMap[offerKey] || { base: true, modules: [] };

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) {
    return jsonRes({ error: 'Configuração de banco de dados incompleta.' }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: existingEvent, error: evCheckErr } = await supabase
    .from('webhook_events')
    .select('event_id')
    .eq('event_id', eventId)
    .maybeSingle();

  if (evCheckErr) {
    console.error('Error checking idempotency:', evCheckErr);
    return jsonRes({ error: 'Erro interno ao verificar evento.' }, 500);
  }
  if (existingEvent) {
    return jsonRes({ message: 'Evento já processado (idempotente).' }, 200);
  }

  if (transactionId) {
    const { data: latestTx, error: txErr } = await supabase
      .from('webhook_events')
      .select('event_created_at')
      .eq('transaction_id', transactionId)
      .order('event_created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (txErr) {
      console.error('Error verifying transaction order:', txErr);
      return jsonRes({ error: 'Erro interno ao validar ordem de eventos.' }, 500);
    }
    if (latestTx?.event_created_at && new Date(eventCreatedAt) < new Date(latestTx.event_created_at)) {
      return jsonRes({ message: 'Evento desatualizado ignorado.' }, 200);
    }
  }

  const protectedEmails = (Deno.env.get('PROTECTED_EMAILS') || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isProtected = protectedEmails.includes(email);

  const { data: profile, error: profileErr } = await supabase
    .from('user_profiles')
    .select('id, has_base_access, premium_features')
    .eq('email', email)
    .maybeSingle();

  if (profileErr) {
    console.error('Error querying profile:', profileErr);
    return jsonRes({ error: 'Erro interno consultando usuário.' }, 500);
  }

  if (profile) {
    if (isGrant) {
      const modulesToPersist = mapping.base && mapping.modules.length === 0
        ? ['base_access']
        : mapping.modules;

      if (modulesToPersist.length > 0) {
        const rows = modulesToPersist.map((mod) => ({
          user_id: profile.id,
          modulo_comprado: mod,
          hotmart_transaction: transactionId || null,
          status: 'active',
        }));
        const { error: upsertErr } = await supabase
          .from('compras_utilizadores')
          .upsert(rows, { onConflict: 'user_id,modulo_comprado' });
        if (upsertErr) {
          console.error('Error upserting compras_utilizadores:', upsertErr);
          return jsonRes({ error: 'Erro registrando módulos comprados.' }, 500);
        }
      }

      const currentModules = new Set<string>(Array.isArray(profile.premium_features) ? profile.premium_features : []);
      for (const mod of mapping.modules) currentModules.add(mod);
      const updatedFeatures = Array.from(currentModules);
      const hasGold = updatedFeatures.includes('vip_gold') || updatedFeatures.includes('total_vip');
      const hasScanner =
        hasGold ||
        updatedFeatures.includes('arsenal_premium') ||
        updatedFeatures.includes('scanner_ia') ||
        updatedFeatures.includes('pacote_elite') ||
        updatedFeatures.includes('assinatura_scanner_ia_ativa');
      const nextBaseAccess = Boolean(profile.has_base_access) || Boolean(mapping.base) || hasGold;

      const { error: updateErr } = await supabase
        .from('user_profiles')
        .update({
          has_base_access: nextBaseAccess,
          premium_features: updatedFeatures,
          acesso_combo_ouro: hasGold,
          assinatura_scanner_ia_ativa: hasScanner,
        })
        .eq('id', profile.id);

      if (updateErr) {
        console.error('Error updating user_profiles on grant:', updateErr);
        return jsonRes({ error: 'Erro atualizando permissões do usuário.' }, 500);
      }
    } else if (isRevoke && !isProtected) {
      if (transactionId) {
        const { error: delByTxErr } = await supabase
          .from('compras_utilizadores')
          .delete()
          .eq('user_id', profile.id)
          .eq('hotmart_transaction', transactionId);
        if (delByTxErr) console.error('Error revoking by transaction:', delByTxErr);
      }

      const modulesToRemove = mapping.base && mapping.modules.length === 0
        ? ['base_access']
        : mapping.modules;

      if (modulesToRemove.length > 0) {
        const { error: delErr } = await supabase
          .from('compras_utilizadores')
          .delete()
          .eq('user_id', profile.id)
          .in('modulo_comprado', modulesToRemove);
        if (delErr) {
          console.error('Error revoking modules:', delErr);
          return jsonRes({ error: 'Erro revogando módulos.' }, 500);
        }
      }

      const { data: remainingPurchases } = await supabase
        .from('compras_utilizadores')
        .select('modulo_comprado, status')
        .eq('user_id', profile.id);

      const remainingSet = new Set<string>(
        Array.isArray(remainingPurchases)
          ? remainingPurchases.filter((p) => !p.status || p.status === 'active').map((p) => p.modulo_comprado)
          : []
      );

      const currentModules = new Set<string>(Array.isArray(profile.premium_features) ? profile.premium_features : []);
      for (const mod of mapping.modules) {
        if (!remainingSet.has(mod)) currentModules.delete(mod);
      }
      for (const mod of remainingSet) {
        if (mod !== 'base_access') currentModules.add(mod);
      }

      const updatedFeatures = Array.from(currentModules);
      const hasGold = updatedFeatures.includes('vip_gold') || updatedFeatures.includes('total_vip');
      const hasScanner =
        hasGold ||
        updatedFeatures.includes('arsenal_premium') ||
        updatedFeatures.includes('scanner_ia') ||
        updatedFeatures.includes('pacote_elite') ||
        updatedFeatures.includes('assinatura_scanner_ia_ativa');

      const stillHasBase = remainingSet.has('base_access') || hasGold;
      const nextBaseAccess = mapping.base ? stillHasBase : Boolean(profile.has_base_access);

      const { error: updateErr } = await supabase
        .from('user_profiles')
        .update({
          has_base_access: nextBaseAccess,
          premium_features: updatedFeatures,
          acesso_combo_ouro: hasGold,
          assinatura_scanner_ia_ativa: hasScanner,
        })
        .eq('id', profile.id);

      if (updateErr) {
        console.error('Error updating user_profiles on revoke:', updateErr);
        return jsonRes({ error: 'Erro revogando permissões do usuário.' }, 500);
      }

      if (eventType === 'PURCHASE_CHARGEBACK') {
        await supabase.auth.admin.signOut(profile.id).catch((e) => console.error('Error signing out chargeback user:', e));
      }
    }
  } else {
    const { data: pending, error: pendingReadErr } = await supabase
      .from('compras_pendentes')
      .select('id, has_base_access, premium_features')
      .eq('email', email)
      .maybeSingle();

    if (pendingReadErr) {
      console.error('Error reading compras_pendentes:', pendingReadErr);
      return jsonRes({ error: 'Erro interno em compras pendentes.' }, 500);
    }

    const pendingModules = new Set<string>(Array.isArray(pending?.premium_features) ? pending.premium_features : []);
    let pendingBase = Boolean(pending?.has_base_access);

    if (isGrant) {
      if (mapping.base) pendingBase = true;
      for (const mod of mapping.modules) pendingModules.add(mod);
    } else if (isRevoke && !isProtected) {
      for (const mod of mapping.modules) pendingModules.delete(mod);
      const stillGold = pendingModules.has('vip_gold') || pendingModules.has('total_vip');
      if (mapping.base && !stillGold) pendingBase = false;
    }

    const { error: pendingUpsertErr } = await supabase
      .from('compras_pendentes')
      .upsert(
        {
          email,
          has_base_access: pendingBase,
          premium_features: Array.from(pendingModules),
          hotmart_transaction: transactionId || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

    if (pendingUpsertErr) {
      console.error('Error saving compras_pendentes:', pendingUpsertErr);
      return jsonRes({ error: 'Erro salvando compra pendente.' }, 500);
    }
  }

  const { error: logErr } = await supabase.from('webhook_events').insert({
    event_id: eventId,
    transaction_id: transactionId || null,
    event_type: eventType,
    email,
    product_id: productKey || offerKey || null,
    event_created_at: eventCreatedAt,
  });

  if (logErr) {
    console.error('Warning logging webhook_events:', logErr);
  }

  return jsonRes({ message: 'Webhook processado com sucesso.' }, 200);
});
