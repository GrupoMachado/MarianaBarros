const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /const generateFakeRanking = \(currentXP, filterMode = 'global', estado = 'WW'\) => \{[\s\S]*?return list;\s*\};/;

const replacement = const generateFakeRanking = (currentXP, filterMode = 'global', estado = 'WW') => {
            const shift = Math.max(0, currentXP - 850);
            
            // Gerar Ranking Local (Estado)
            let localList = [];
            for (let i = 0; i < 50; i++) {
                let base = 0;
                if (i === 0) base = 990;
                else if (i === 1) base = 950;
                else if (i === 2) base = 920;
                else if (i === 3) base = 890;
                else if (i === 4) base = 860;
                else base = Math.max(0, 860 - ((i - 4) * 30));
                
                const variance = (i * 17) % 20;
                const xpFinal = base + shift + variance;

                localList.push({
                    id: \\mock-local-\\\\,
                    name: MOCK_BR[i % MOCK_BR.length],
                    xp: xpFinal,
                    level: Math.floor(xpFinal / 1000) + 1,
                    estado: estado,
                    isFake: true,
                    avatar: i === 0 ? '?????' : i === 1 ? '??' : i === 2 ? '?????' : '??'
                });
            }

            // Gerar Ranking Internacional (Mundial)
            let intlList = [];
            for (let i = 0; i < 50; i++) {
                let base = 0;
                if (i === 0) base = 1100;
                else if (i === 1) base = 1050;
                else if (i === 2) base = 1010;
                else if (i === 3) base = 970;
                else if (i === 4) base = 940;
                else base = Math.max(0, 940 - ((i - 4) * 25));
                
                const variance = (i * 13) % 20;
                const xpFinal = base + shift + variance;

                intlList.push({
                    id: \\mock-intl-\\\\,
                    name: MOCK_INTL[i % MOCK_INTL.length],
                    xp: xpFinal,
                    level: Math.floor(xpFinal / 1000) + 1,
                    estado: 'WW',
                    isFake: true,
                    avatar: i === 0 ? '??' : i === 1 ? '??' : i === 2 ? '?????' : '??'
                });
            }

            if (filterMode === 'local') {
                return localList;
            } else {
                let combined = [...intlList, ...localList];
                combined.sort((a, b) => b.xp - a.xp);
                combined.forEach((u, idx) => {
                    if (u.id.includes('intl')) {
                        const fakeEstados = ['WW', 'US', 'EU', 'AS', 'UK'];
                        u.estado = fakeEstados[(idx * 7) % fakeEstados.length];
                    }
                });
                return combined.slice(0, 50);
            }
        };;

code = code.replace(regex, replacement);
fs.writeFileSync('index.html', code);
console.log('Fixed generateFakeRanking');
