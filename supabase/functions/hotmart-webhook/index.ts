import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  // 1. Validar Método
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const payload = await req.json()
    
    // 2. Segurança: Validar hottok (Token de Segurança da Hotmart)
    // O hottok deve ser configurado na Hotmart e verificado aqui para garantir que o request veio deles.
    const hottok = req.headers.get('hottok')
    const SECRET_HOTTOK = Deno.env.get('HOTMART_HOTTOK')
    
    if (hottok !== SECRET_HOTTOK) {
      // return new Response('Unauthorized', { status: 401 })
      // Nota: Durante testes, podes comentar o bloqueio ou usar um log
      console.log('Aviso: Hottok inválido ou não fornecido')
    }

    // 3. Extrair Dados Relevantes
    // Estrutura simplificada do payload da Hotmart (ajustar conforme documentação oficial da versão do Webhook)
    const email = payload.data?.buyer?.email || payload.email
    const status = payload.data?.purchase?.status || payload.status
    const productId = payload.data?.product?.id || payload.product_id

    if (!email) {
      return new Response('Email missing', { status: 400 })
    }

    // 4. Lógica de Negócio: Mapear Product ID para Permissões
    // Lista de exceções - emails que NUNCA perdem o acesso (mesmo que cancelem)
    const PROTECTED_EMAILS = [
      'teste.atoa@gmail.com', // <-- Podes alterar este email e adicionar mais
    ]

    // Verificar se o status é ativo ou se o email está protegido
    const activeStatuses = ['APPROVED', 'COMPLETED', 'ACTIVE']
    const isActive = activeStatuses.includes(status?.toUpperCase())
    const isProtected = PROTECTED_EMAILS.includes(email.toLowerCase())

    let hasBaseAccess = isActive || isProtected
    let premiumFeatures: string[] = []

    if (hasBaseAccess && productId === 'ARSENAL_PREMIUM_ID') { // Substituir pelo ID real da Hotmart
      premiumFeatures.push('arsenal_premium')
    }

    // 5. Instanciar Cliente Supabase (Service Role para bypass RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 6. Verificar se o Utilizador já existe no 'user_profiles'
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email_backup', email) // Assumindo que guardas o email no perfil ou via join com auth.users
      .single()

    if (profile) {
      // Caso o utilizador já tenha conta, atualiza diretamente
      await supabase
        .from('user_profiles')
        .update({ 
          has_base_access: hasBaseAccess,
          premium_features: premiumFeatures // Nota: Idealmente fazer um merge/append se já tiver outros
        })
        .eq('id', profile.id)
    } else {
      // Caso contrário, guarda em 'compras_pendentes' para o futuro Sign Up
      await supabase
        .from('compras_pendentes')
        .upsert({
          email: email,
          has_base_access: hasBaseAccess,
          premium_features: premiumFeatures
        }, { onConflict: 'email' })
    }

    return new Response(JSON.stringify({ message: 'Webhook processed successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
