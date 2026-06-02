const config = require('./config.js')

async function applyChange() {
  console.log('A fazer uma alteração à toa na Supabase...')
  
  const response = await fetch(`${config.SUPABASE_URL}/rest/v1/compras_pendentes?on_conflict=email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.SUPABASE_KEY,
      'Authorization': `Bearer ${config.SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      email: 'teste.atoa@gmail.com',
      has_base_access: true,
      premium_features: ['arsenal_premium', 'excecao_cancelamento']
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Erro ao adicionar na Supabase:', err)
  } else {
    console.log('✅ Alteração feita com sucesso na Supabase! O email teste.atoa@gmail.com foi adicionado com acessos garantidos.')
  }
}

applyChange()
