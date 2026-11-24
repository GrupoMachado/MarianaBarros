// Configuração pública do cliente (APENAS chave pública ANON do Supabase — NUNCA usar service_role aqui).
;(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.APP_CONFIG = factory()
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return {
    SUPABASE_URL: 'https://wutjxjubudszwgvxedgm.supabase.co',
    SUPABASE_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGp4anVidWRzendndnhlZGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDY4NjYsImV4cCI6MjA5MDcyMjg2Nn0.aCdviWK8v_OwkRAVt7lLJW7ezv1lcpCokNCFu8XnFQc',
  }
})
