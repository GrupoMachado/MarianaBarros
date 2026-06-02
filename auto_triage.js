const fs = require('fs');
const https = require('https');

// Lê os 792 vídeos do file URLs que criámos há pouco
const videos = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

const { SUPABASE_URL, SUPABASE_KEY } = require('./config.js');
const SUPABASE_HOST = new URL(SUPABASE_URL).host;

function categorize(title) {
    const t = title.toLowerCase();
    
    // Core
    if (t.includes('abd') || t.includes('core') || t.includes('prancha') || t.includes('canivete') || t.includes('crunch') || t.includes('infra') || t.includes('supra') || t.includes('remador') || t.includes('obli') || t.includes('russian')) {
        if (t.includes('obli') || t.includes('lateral') || t.includes('russian')) return { category: 'Core', target_muscle: 'Óblicos' };
        return { category: 'Core', target_muscle: 'Abdominal Reto' };
    }
    // Pernas & Glúteos
    if (t.includes('agachamento') || t.includes('perna') || t.includes('panturrilha') || t.includes('gemeos') || t.includes('glúteo') || t.includes('gluteo') || t.includes('afundo') || t.includes('stiff') || t.includes('elevação pélvica') || t.includes('leg press') || t.includes('extensora') || t.includes('flexora') || t.includes('sumô') || t.includes('sumo') || t.includes('bulgaro') || t.includes('búlgaro') || t.includes('inferior') || t.includes('step')) {
        if (t.includes('glúteo') || t.includes('gluteo') || t.includes('eleva') || t.includes('pélvica') || t.includes('pelvica')) return { category: 'Pernas', target_muscle: 'Glúteos' };
        if (t.includes('stiff') || t.includes('flexora') || t.includes('posterior')) return { category: 'Pernas', target_muscle: 'Posterior (Isquiotibiais)' };
        if (t.includes('panturrilha') || t.includes('gemeo')) return { category: 'Pernas', target_muscle: 'Gémeos (Panturrilha)' };
        return { category: 'Pernas', target_muscle: 'Quadríceps' };
    }
    // Costas
    if (t.includes('costa') || t.includes('puxada') || t.includes('remada') || t.includes('pull') || t.includes('barra fixa') || t.includes('lombar') || t.includes('dorsal')) {
        if (t.includes('lombar') || t.includes('extensão de tronco')) return { category: 'Costas', target_muscle: 'Lombar' };
        if (t.includes('encolhimento') || t.includes('trapezio') || t.includes('trapézio')) return { category: 'Costas', target_muscle: 'Trapézio' };
        return { category: 'Costas', target_muscle: 'Dorsais (Lats)' };
    }
    // Peito
    if (t.includes('peito') || t.includes('supino') || t.includes('crucifixo') || t.includes('flexão') || t.includes('flexao') || t.includes('voador') || t.includes('superior') || t.includes('push')) {
        if (t.includes('inclinado') || t.includes('superior')) return { category: 'Peito', target_muscle: 'Peitoral Superior' };
        if (t.includes('declinado')) return { category: 'Peito', target_muscle: 'Peitoral Inferior' };
        return { category: 'Peito', target_muscle: 'Peitoral Maior' };
    }
    // Ombros
    if (t.includes('ombro') || t.includes('desenvolvimento') || t.includes('elevação') || t.includes('elevacao') || t.includes('manguito') || t.includes('face') || t.includes('front') || t.includes('lateral')) {
        if (t.includes('lateral')) return { category: 'Ombros', target_muscle: 'Deltoide Médio' };
        if (t.includes('frontal') || t.includes('frente')) return { category: 'Ombros', target_muscle: 'Deltoide Anterior' };
        if (t.includes('posterior') || t.includes('face pull')) return { category: 'Ombros', target_muscle: 'Deltoide Posterior' };
        return { category: 'Ombros', target_muscle: 'Deltoide Anterior' };
    }
    // Braços
    if (t.includes('braço') || t.includes('braco') || t.includes('biceps') || t.includes('bíceps') || t.includes('triceps') || t.includes('tríceps') || t.includes('rosca') || t.includes('testa') || t.includes('frances') || t.includes('curl')) {
        if (t.includes('triceps') || t.includes('tríceps') || t.includes('testa') || t.includes('frances') || t.includes('corda')) return { category: 'Braços', target_muscle: 'Tríceps' };
        return { category: 'Braços', target_muscle: 'Bíceps' };
    }
    
    // Fallback genérico para cardio / funcional / hiit
    if (t.includes('hiit') || t.includes('boxe') || t.includes('cardio') || t.includes('corrida') || t.includes('polichinelo') || t.includes('burpee') || t.includes('treino') || t.includes('completo')) {
        return { category: 'Pernas', target_muscle: 'Quadríceps' };
    }
    
    // Core default
    return { category: 'Core', target_muscle: 'Abdominal Reto' };
}

// Cria o payload final
const payload = videos.map(v => {
    const { category, target_muscle } = categorize(v.title);
    return {
        title: v.title.replace('.mp4', '').replace('.mov', '').trim(),
        category: category,
        target_muscle: target_muscle,
        video_url: v.url,
        is_enabled: true
    };
});

// Envia por chunking usando nativo (como não estamos num browser, contornamos CORS)
function chunkArray(array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
}

const chunks = chunkArray(payload, 200);

async function uploadToSupabase() {
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const dataStr = JSON.stringify(chunk);
        
        const options = {
            hostname: SUPABASE_HOST,
            path: '/rest/v1/exercises',
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
                'Content-Length': Buffer.byteLength(dataStr)
            }
        };
        
        await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (d) => { body += d; });
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log(`Lote ${i+1}/${chunks.length} inserido com sucesso (${chunk.length} exercícios).`);
                        resolve();
                    } else {
                        console.error('Erro no Supabase:', res.statusCode, body);
                        reject(new Error(body));
                    }
                });
            });
            req.on('error', reject);
            req.write(dataStr);
            req.end();
        });
    }
    console.log(`\nTodos os ${payload.length} exercícios foram guardados! Missão cumprida.`);
}

uploadToSupabase().catch(console.error);
