// Endpoint neutralizado por segurança (antigo proxy aberto com service_role).
export async function onRequest() {
  return new Response(
    JSON.stringify({
      error: 'Endpoint desativado por segurança. Utilize o cliente Supabase com chave pública ANON e RLS.',
    }),
    {
      status: 410,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  );
}
