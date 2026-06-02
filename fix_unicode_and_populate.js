const fs = require('fs');
const filePath = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Fix Unicorn/Emoji Literals
content = content.replace(/\\u26A1/g, '⚡');
content = content.replace(/\\uD83D\\uDD25/g, '🔥');
content = content.replace(/\\uD83D\\uDCAA/g, '💪');
content = content.replace(/\\uD83E\\uDDB5/g, '🦵');
content = content.replace(/\\uD83C\\uDFAF/g, '🎯');
content = content.replace(/\\uD83C\\uDF3F/g, '🌿');


// 2. Populate missing exercises
// We'll extract the TREINO_MOCK, parse it, add exercises to empty areas, and put it back.
const jsonLikeMockMatch = content.match(/const TREINO_MOCK = (\{[\s\S]*?\});\n\n        const ExerciciosCardCustom/);

if (jsonLikeMockMatch) {
    let mockStr = jsonLikeMockMatch[1];
    
    // Using eval to parse the JS object literal since it's not strict JSON
    let mock;
    eval('mock = ' + mockStr);
    
    const areasComExercicios = new Set(mock.exercicios.map(e => e.area_id));
    
    let exIdCounter = 100;
    
    mock.areas.forEach(area => {
        if (!areasComExercicios.has(area.id)) {
            // Se esta área não tiver nenhum exercício, adicionamos 2 fictícios
            mock.exercicios.push({
                id: 'ex_gen_' + (exIdCounter++),
                area_id: area.id,
                nome: `Treino Isolado: ${area.nome}`,
                nivel: 'Intermediário',
                sets_reps: '3x 12',
                duracao_minutos: 5,
                sprite_pos: '40% 66.666%', // Um genérico caso falhe
                is_enabled: true
            });
            mock.exercicios.push({
                id: 'ex_gen_' + (exIdCounter++),
                area_id: area.id,
                nome: `${area.nome} (Variação B)`,
                nivel: 'Avançado',
                sets_reps: '4x 10',
                duracao_minutos: 6,
                sprite_pos: '20% 0%', // Genérico
                is_enabled: true
            });
        }
    });
    
    // Now convert it back to string. We'll use JSON.stringify and then clean quotes from keys for aesthetics if we care, 
    // but standard JSON works fine as a JS literal.
    const newMockStr = JSON.stringify(mock, null, 4);
    
    content = content.replace(jsonLikeMockMatch[1], newMockStr);
    console.log('Exercícios gerados para áreas vazias.');
} else {
    console.log('Não encontrou o TREINO_MOCK');
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Unicode corrigido e guardado.');
