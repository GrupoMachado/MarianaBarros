const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const startIdx = content.indexOf('            "id": "ex_gen_102",');
const endIdx = content.indexOf('    ]\n};', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `            "id": "ex_gen_102",
            "area_id": "a_c5",
            "nome": "Treino Costas Laterais",
            "nivel": "Intermediário",
            "sets_reps": "3x 12",
            "duracao_minutos": 5,
            "sprite_pos": "40% 66.666%",
            "is_enabled": true
        }
`;
    content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Fixed corrupted JSON chunk.");
} else {
    console.log("Could not find the indices.");
}
