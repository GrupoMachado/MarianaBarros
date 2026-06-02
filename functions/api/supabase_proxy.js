export async function onRequest(context) {
  const { request, env } = context;
  
  // 1. Verificar se as chaves existem no ambiente da Cloudflare
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Configuração incompleta na Cloudflare (Faltam Variáveis de Ambiente)." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 2. Extrair o destino da query (ex: /rest/v1/user_profiles)
  const url = new URL(request.url);
  const targetPath = url.searchParams.get("path");
  
  if (!targetPath) {
    return new Response(JSON.stringify({ error: "Path não especificado." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 3. Montar a URL final para o Supabase
  const supabaseUrl = `${env.SUPABASE_URL}${targetPath}`;

  // 4. Reaminaminhar a requisição com a SERVICE_ROLE_KEY (Segura no servidor)
  const response = await fetch(supabaseUrl, {
    method: request.method,
    headers: {
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": request.headers.get("Prefer") || ""
    },
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : null
  });

  // 5. Devolver a resposta para o browser
  const data = await response.text();
  return new Response(data, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" // Ajustar conforme necessário para segurança
    }
  });
}
