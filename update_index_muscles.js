const fs = require('fs');
const filePath = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

// Atualizar exercícios com sprite_pos
const regexExercicios = /exercicios: \[\s*\{ id: 'e1'[\s\S]*?\}\s*\]/m;
const mockExercicios = `exercicios: [
        { id: 'e1', area_id: 'a1', nome: 'Flexões Inclinadas', nivel: 'Intermediário', sets_reps: '4x 12', duracao_minutos: 5, sprite_pos: '20% 0%', is_enabled: true },
        { id: 'e2', area_id: 'a1', nome: 'Press Inclinado com Halteres', nivel: 'Avançado', sets_reps: '3x 10', duracao_minutos: 4, sprite_pos: '20% 0%', is_enabled: true },
        { id: 'e3', area_id: 'a2', nome: 'Flexões Normais', nivel: 'Iniciante', sets_reps: '3x 15', duracao_minutos: 5, sprite_pos: '20% 0%', is_enabled: true },
        { id: 'e4', area_id: 'a3', nome: 'Dips / Paralelas', nivel: 'Intermediário', sets_reps: '3x 12', duracao_minutos: 4, sprite_pos: '60% 66.666%', is_enabled: true },
        { id: 'e5', area_id: 'a4', nome: 'Elevações (Pull-ups)', nivel: 'Intermediário', sets_reps: '4x 8', duracao_minutos: 6, sprite_pos: '20% 66.666%', is_enabled: true },
        { id: 'e6', area_id: 'a6', nome: 'Curl com Halteres', nivel: 'Iniciante', sets_reps: '3x 12', duracao_minutos: 4, sprite_pos: '60% 0%', is_enabled: true }
    ]`;
content = content.replace(regexExercicios, mockExercicios);

// Substituir a tag IMG no ExerciciosCardCustom por uma Div anatomy-sprite
const imgRegex = /<img src=\{ex\.thumbnail_url[\s\S]*?objectFit: 'cover' \}\} \/>/;
const anatomyDiv = `<div style={{ width: '100%', height: '100%', backgroundSize: '600% 400%', backgroundRepeat: 'no-repeat', backgroundImage: 'url("muscles.png")', backgroundPosition: ex.sprite_pos, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1)) brightness(0.9) contrast(1.1)' }}></div>`;
content = content.replace(imgRegex, anatomyDiv);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Atlas aplicado no UI com sucesso!');
