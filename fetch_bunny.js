// Script administrativo local: a chave Bunny deve ser fornecida via variável de ambiente BUNNY_API_KEY.
const https = require('https');

const apiKey = process.env.BUNNY_API_KEY;
if (!apiKey) {
  console.error('Define BUNNY_API_KEY antes de executar este script.');
  process.exit(1);
}

const options = {
  hostname: 'video.bunnycdn.com',
  path: '/library/630822/videos?page=1&itemsPerPage=1000',
  method: 'GET',
  headers: {
    AccessKey: apiKey,
    accept: 'application/json',
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Vídeos encontrados:', Array.isArray(json?.items) ? json.items.length : 0);
    } catch (err) {
      console.error('Erro ao ler resposta da Bunny:', err.message);
    }
  });
});

req.on('error', (err) => console.error('Erro de rede:', err.message));
req.end();
