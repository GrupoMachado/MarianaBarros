# 🛡️ Guia de Segurança Cloudflare + Supabase

Para tornares as tuas chaves **impossíveis de ver** no browser, segue estes passos após fazeres o upload do projeto para a **Cloudflare Pages**:

## 1. Configurar Variáveis de Ambiente
No painel da Cloudflare (Settings > Functions > Variables and Secrets), adiciona as seguintes variáveis:

| Nome | Valor |
| :--- | :--- |
| `SUPABASE_URL` | `https://wutjxjubudszwgvxedgm.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGp4anVidWRzendndnhlZGdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE0Njg2NiwiZXhwIjoyMDkwNzIyODY2fQ.w4ZbytunBRStZXYCt-AkrPd23djPVFwe1ppTNG8HsiY` |

## 2. Como o código funciona agora
1. Criei uma pasta chamada `/functions/api/`. 
2. O ficheiro `supabase_proxy.js` dentro dessa pasta corre apenas nos servidores da Cloudflare.
3. Quando o teu site precisar de dados "secretos", ele chama `/api/supabase_proxy?path=...`.
4. A Cloudflare usa a chave guardada internamente para falar com o Supabase e devolve-te os dados.

## 3. Próximo Passo
Atualmente o `index.html` ainda usa o método direto (expondo a chave). Quando estiveres pronto para "bloquear" tudo, eu posso alterar o `index.html` para falar apenas com esta nova API segura.

> [!IMPORTANT]
> **Atenção:** Este método só funciona quando o site estiver publicado na Cloudflare. No teu PC (abrir o ficheiro diretamente), ele não conseguirá encontrar a pasta `/api/`, por isso deves manter o `config.js` apenas para testes locais.
