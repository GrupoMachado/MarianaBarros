# Guia de Segurança Cloudflare Pages + Supabase

- Nunca coloques `SUPABASE_SERVICE_ROLE_KEY` no frontend nem na Cloudflare Pages.
- Utiliza apenas a chave pública `anon` (já configurada em `public/config.js` e `dist/config.js`).
- Operações administrativas e webhooks (Hotmart, Nutri-Scan IA, eliminação de conta) correm apenas nas Supabase Edge Functions com RLS ativo.
