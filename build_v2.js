const fs = require('fs');

const videos = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Admin Triage - Classificar Vídeos (V2)</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="./config.js"></script>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f1f5f9; display: flex; height: 100vh; overflow: hidden; }
        .left { flex: 1; background: #000; display: flex; align-items: center; justify-content: center; position: relative; border-right: 1px solid #334155; }
        .left video { width: 100%; height: 100%; object-fit: contain; }
        .right { width: 420px; background: #1e293b; padding: 32px; display: flex; flex-direction: column; overflow-y: auto; box-shadow: -4px 0 15px rgba(0,0,0,0.5); }
        h1 { margin-top: 0; font-size: 24px; text-align: center; margin-bottom: 24px; font-weight: 800; color: #fff; }
        
        .counter { text-align: center; margin-bottom: 24px; color: #f97316; font-weight: 900; background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.3); padding: 12px; border-radius: 8px; font-size: 18px; }
        
        .form-section label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #cbd5e1; }
        .form-section input, .form-section select { width: 100%; padding: 16px; margin-bottom: 24px; border-radius: 10px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 16px; box-sizing: border-box; transition: 0.2s; outline: none; }
        .form-section input:focus, .form-section select:focus { border-color: #22c55e; box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2); }
        
        button.save { background: #22c55e; color: #fff; border: none; padding: 20px; border-radius: 12px; font-size: 20px; font-weight: 900; cursor: pointer; transition: 0.2s; margin-top: auto; box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3); }
        button.save:hover { background: #16a34a; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(34, 197, 94, 0.4); }
        button.save:active { transform: translateY(0); }
        button.save:disabled { background: #475569; cursor: not-allowed; box-shadow: none; transform: none; }
        
        .alert { padding: 16px; border-radius: 8px; margin-bottom: 24px; display: none; font-weight: 600; font-size: 14px; text-align: center; }
        .alert.success { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); display: block; }
        .alert.error { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); display: block; }
    </style>
</head>
<body>

    <div class="left">
        <video id="video-player" controls autoplay muted loop></video>
    </div>

    <div class="right">
        <h1>🛠️ Motor de Triage (V2)</h1>
        
        <div id="alert" class="alert"></div>
        <div id="debug" style="color:red; font-size:12px; margin-bottom:10px;"></div>

        <div class="counter" id="counter">Carregando script...</div>

        <div class="form-section">
            <label>Nome do Exercício</label>
            <input type="text" id="ex-name" placeholder="Ex: Supino Reto com Barra" />

            <label>Grupo Muscular</label>
            <select id="ex-group">
                <option value="">Selecione...</option>
                <option value="Peito">Peito</option>
                <option value="Costas">Costas</option>
                <option value="Pernas">Pernas</option>
                <option value="Ombros">Ombros</option>
                <option value="Braços">Braços</option>
                <option value="Core">Core</option>
            </select>

            <label>Músculo Alvo</label>
            <select id="ex-target">
                <option value="">Selecione primeiro o Grupo</option>
            </select>
        </div>

        <button id="save-btn" class="save">Guardar & Próximo</button>
    </div>

    <script>
        window.onerror = function(msg, url, line, col, error) {
            document.getElementById('debug').innerHTML += "ERRO: " + msg + " (Linha: " + line + ")<br>";
        };
        
        document.addEventListener('DOMContentLoaded', () => {
            try {
                // Video Database Injected Natively
                const videoList = JSON.parse(\`${JSON.stringify(videos).replace(/\\/g, '\\\\').replace(/\$/g, '\\$').replace(/\`/g, '\\`')}\`);
                let currentIndex = 0;

                // DOM Elements
                const elPlayer = document.getElementById('video-player');
                const elCounter = document.getElementById('counter');
                const elName = document.getElementById('ex-name');
                const elGroup = document.getElementById('ex-group');
                const elTarget = document.getElementById('ex-target');
                const elSaveBtn = document.getElementById('save-btn');
                const elAlert = document.getElementById('alert');
                
                // Supabase Init Lazy
                let supabase = null;
                const { SUPABASE_URL, SUPABASE_KEY } = window.APP_CONFIG || {};

                // Target Muscles mapping based on selected Group
                const targetsByGroup = {
                    'Peito': ['Peitoral Maior', 'Peitoral Superior', 'Peitoral Inferior'],
                    'Costas': ['Dorsais (Lats)', 'Trapézio', 'Lombar', 'Romboides'],
                    'Pernas': ['Quadríceps', 'Glúteos', 'Posterior (Isquiotibiais)', 'Gémeos (Panturrilha)'],
                    'Ombros': ['Deltoide Anterior', 'Deltoide Médio', 'Deltoide Posterior'],
                    'Braços': ['Bíceps', 'Tríceps', 'Antebraços'],
                    'Core': ['Abdominal Reto', 'Óblicos', 'Transverso']
                };

                // Handle Group Change
                elGroup.addEventListener('change', (e) => {
                    const group = e.target.value;
                    elTarget.innerHTML = '<option value="">Selecione o Músculo Alvo...</option>';
                    if (group && targetsByGroup[group]) {
                        targetsByGroup[group].forEach(t => {
                            const opt = document.createElement('option');
                            opt.value = t;
                            opt.textContent = t;
                            elTarget.appendChild(opt);
                        });
                    }
                });

                function showAlert(msg, type) {
                    elAlert.textContent = msg;
                    elAlert.className = "alert " + type;
                    setTimeout(() => {
                        elAlert.className = 'alert';
                    }, 3000);
                }

                function updateUI() {
                    if (currentIndex >= videoList.length) {
                        elCounter.textContent = '✅ Todos os vídeos concluídos!';
                        elPlayer.src = '';
                        elName.disabled = true;
                        elGroup.disabled = true;
                        elTarget.disabled = true;
                        elSaveBtn.disabled = true;
                        return;
                    }
                    
                    const faltam = videoList.length - currentIndex;
                    elCounter.textContent = "Faltam " + faltam + " vídeos";
                    
                    const currentVideo = videoList[currentIndex];
                    elPlayer.src = currentVideo.url;
                    elName.value = currentVideo.title; 
                    elName.focus();
                }

                elSaveBtn.addEventListener('click', async () => {
                    if (currentIndex >= videoList.length) return;

                    const name = elName.value.trim();
                    const group = elGroup.value;
                    const target = elTarget.value;
                    const url = videoList[currentIndex].url;

                    if (!name || !group || !target) {
                        showAlert('Preenche Nome, Grupo e Músculo Alvo.', 'error');
                        return;
                    }
                    
                    if (!supabase) {
                        try {
                            if (!window.supabase) throw new Error("A CDN do Supabase não carregou! Desativa adblockers.");
                            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                        } catch(e) {
                            showAlert(e.message, 'error');
                            return;
                        }
                    }

                    elSaveBtn.disabled = true;
                    const originalText = elSaveBtn.textContent;
                    elSaveBtn.textContent = 'A guardar... ⏳';

                    const payload = { 
                        title: name, 
                        category: group, 
                        target_muscle: target, 
                        video_url: url,
                        is_enabled: true 
                    };
                    
                    try {
                        const { error } = await supabase.from('exercises').insert([payload]);

                        elSaveBtn.disabled = false;
                        elSaveBtn.textContent = originalText;

                        if (error) {
                            console.error(error);
                            showAlert("Erro: " + error.message, 'error');
                            return;
                        }

                        showAlert("✅ Vídeo guardado!", 'success');
                        currentIndex++;
                        
                        elGroup.value = '';
                        elTarget.innerHTML = '<option value="">Selecione primeiro o Grupo</option>';

                        updateUI();
                    } catch (err) {
                        elSaveBtn.disabled = false;
                        elSaveBtn.textContent = originalText;
                        showAlert("Erro de rede ao guardar.", 'error');
                    }
                });

                // Start Application
                elCounter.textContent = "Carregado com sucesso!";
                setTimeout(() => updateUI(), 500);

            } catch (err) {
                document.getElementById('debug').innerHTML += "MAIN ERRO: " + err.message;
            }
        });
    </script>
</body>
</html>`;

fs.writeFileSync('C:\\Users\\rafae\\Desktop\\APP\\admin-triage.html', html, 'utf8');
console.log('HTML rewritten');
