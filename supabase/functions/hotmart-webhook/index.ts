import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    console.log("Webhook Recebido da Hotmart:", JSON.stringify(payload));

    // Hotmart Webhook V2 format for successful purchases
    if (payload.event === 'PURCHASE_APPROVED' || payload.event === 'PURCHASE_COMPLETE') {
      // The username we passed via ?src=username should be in data.tracking.source
      const username = payload.data?.tracking?.source;

      if (username) {
        console.log(`A desbloquear acesso PRO para o utilizador: ${username}`);
        
        // We use SUPABASE_SERVICE_ROLE_KEY to bypass any security restrictions (RLS)
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error } = await supabase
          .from('profiles')
          .update({ has_ai_access: true })
          .eq('username', username);

        if (error) {
          console.error("Erro ao atualizar base de dados:", error);
          return new Response("Error updating profile", { status: 500 });
        }

        console.log("Perfil atualizado com sucesso!");
        return new Response("Unlocked successfully", { status: 200 });
      } else {
        console.log("Compra aprovada, mas não foi encontrado nenhum 'src' (username) no rastreamento.");
      }
    }

    return new Response("Webhook processado", { status: 200 });
  } catch (error) {
    console.error("Erro a ler o payload:", error);
    return new Response("Bad request", { status: 400 });
  }
});
