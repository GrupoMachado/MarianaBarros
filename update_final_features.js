const fs = require('fs');
const filePath = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

const regexTreinoMock = /const TREINO_MOCK = {[\s\S]*?};\n\n        const ExerciciosCardCustom/m;

const mockDataFull = `const TREINO_MOCK = {
    grupos: [
        { id: 'g1', nome: 'Membros Superiores', icone_name: '\\uD83D\\uDCAA' },
        { id: 'g2', nome: 'Membros Inferiores', icone_name: '\\uD83E\\uDDB5' },
        { id: 'g3', nome: 'Abdominais', icone_name: '\\uD83C\\uDFAF' },
        { id: 'g4', nome: 'Cardio & Mobilidade', icone_name: '\\uD83C\\uDF3F' }
    ],
    musculos: [
        // Superiores
        { id: 'm1', group_id: 'g1', nome: 'Peitoral' },
        { id: 'm2', group_id: 'g1', nome: 'Costas' },
        { id: 'm3', group_id: 'g1', nome: 'Ombros' },
        { id: 'm4', group_id: 'g1', nome: 'Braços' },
        
        // Inferiores
        { id: 'm5', group_id: 'g2', nome: 'Quadríceps' },
        { id: 'm6', group_id: 'g2', nome: 'Posteriores' },
        { id: 'm7', group_id: 'g2', nome: 'Glúteos' },
        { id: 'm8', group_id: 'g2', nome: 'Panturrilhas' },
        { id: 'm9', group_id: 'g2', nome: 'Abdutores e Pelve' },

        // Core -> Abdominais
        { id: 'm10', group_id: 'g3', nome: 'Reto Abdominal' },
        { id: 'm11', group_id: 'g3', nome: 'Oblíquos e Core' },

        // Cardio
        { id: 'm12', group_id: 'g4', nome: 'Cardio / HIIT' },
        { id: 'm13', group_id: 'g4', nome: 'Mobilidade' }
    ],
    areas: [
        // Peitoral (m1)
        { id: 'a_p1', muscle_id: 'm1', nome: 'Peito Completo' },
        { id: 'a_p2', muscle_id: 'm1', nome: 'Peito Superior' },
        { id: 'a_p3', muscle_id: 'm1', nome: 'Peito Inferior' },

        // Costas (m2)
        { id: 'a_c1', muscle_id: 'm2', nome: 'Trapézio e Pescoço' },
        { id: 'a_c2', muscle_id: 'm2', nome: 'Trapézio e Rombóides (Costas)' },
        { id: 'a_c3', muscle_id: 'm2', nome: 'Grande Dorsal' },
        { id: 'a_c4', muscle_id: 'm2', nome: 'Lombar' },
        { id: 'a_c5', muscle_id: 'm2', nome: 'Costas Laterais' },

        // Ombros (m3)
        { id: 'a_o1', muscle_id: 'm3', nome: 'Deltóide Frontal / Médio' },
        { id: 'a_o2', muscle_id: 'm3', nome: 'Deltóide Posterior' },

        // Braços (m4)
        { id: 'a_b1', muscle_id: 'm4', nome: 'Bíceps' },
        { id: 'a_b2', muscle_id: 'm4', nome: 'Tríceps' },
        { id: 'a_b3', muscle_id: 'm4', nome: 'Antebraços' },
        { id: 'a_b4', muscle_id: 'm4', nome: 'Punhos e Mãos' },

        // Quadríceps (m5)
        { id: 'a_q1', muscle_id: 'm5', nome: 'Quadríceps Frontal (Perna Base)' },
        { id: 'a_q2', muscle_id: 'm5', nome: 'Vastos (Isolado)' },

        // Posteriores (m6)
        { id: 'a_po1', muscle_id: 'm6', nome: 'Isquiotibiais' },

        // Glúteos (m7)
        { id: 'a_g1', muscle_id: 'm7', nome: 'Glúteo Completo' },

        // Panturrilhas (m8)
        { id: 'a_pa1', muscle_id: 'm8', nome: 'Panturrilhas (Perfil)' },
        { id: 'a_pa2', muscle_id: 'm8', nome: 'Panturrilhas (Posterior)' },

        // Abdutores e Pelve (m9)
        { id: 'a_qa1', muscle_id: 'm9', nome: 'Psoas / Flexores' },
        { id: 'a_qa2', muscle_id: 'm9', nome: 'Abdutores / Fáscia Lata' },

        // Reto Abdominal (m10)
        { id: 'a_ab1', muscle_id: 'm10', nome: 'Abdominal Superior' },
        { id: 'a_ab2', muscle_id: 'm10', nome: 'Gomos Centrais' },

        // Oblíquos / Core (m11)
        { id: 'a_ob1', muscle_id: 'm11', nome: 'Oblíquos / Serrátil' },
        { id: 'a_ob2', muscle_id: 'm11', nome: 'Core Completo (Reforço)' },

        // Cardio (m12)
        { id: 'a_ca1', muscle_id: 'm12', nome: 'Alta Intensidade (HIIT)' },
        { id: 'a_ca2', muscle_id: 'm12', nome: 'Resistência / LISS' },

        // Mobilidade (m13)
        { id: 'a_mo1', muscle_id: 'm13', nome: 'Alongamento Dinâmico' },
    ],
    exercicios: [
        // Peitoral
        { id: 'ex_peit_1', area_id: 'a_p1', nome: 'Flexões Normais', nivel: 'Intermediário', sets_reps: '4x 12', duracao_minutos: 5, sprite_pos: '20% 0%', is_enabled: true },
        { id: 'ex_peit_2', area_id: 'a_p2', nome: 'Flexões Inclinadas', nivel: 'Iniciante', sets_reps: '3x 10', duracao_minutos: 4, sprite_pos: '20% 0%', is_enabled: true },
        { id: 'ex_peit_3', area_id: 'a_p3', nome: 'Dips / Fundos para Peito', nivel: 'Avançado', sets_reps: '4x 10', duracao_minutos: 5, sprite_pos: '20% 0%', is_enabled: true },

        // Costas
        { id: 'ex_c_1', area_id: 'a_c1', nome: 'Encolhimentos', nivel: 'Iniciante', sets_reps: '4x 15', duracao_minutos: 4, sprite_pos: '0% 0%', is_enabled: true },
        { id: 'ex_c_3', area_id: 'a_c3', nome: 'Elevações Pull-Ups', nivel: 'Avançado', sets_reps: '4x 8', duracao_minutos: 6, sprite_pos: '20% 66.666%', is_enabled: true },
        { id: 'ex_c_4', area_id: 'a_c4', nome: 'Extensão Lombar', nivel: 'Intermediário', sets_reps: '3x 15', duracao_minutos: 5, sprite_pos: '40% 66.666%', is_enabled: true },

        // Ombros
        { id: 'ex_o_1', area_id: 'a_o1', nome: 'Press Militar', nivel: 'Intermediário', sets_reps: '4x 10', duracao_minutos: 6, sprite_pos: '40% 0%', is_enabled: true },
        { id: 'ex_o_2', area_id: 'a_o2', nome: 'Face Pull', nivel: 'Intermediário', sets_reps: '3x 15', duracao_minutos: 5, sprite_pos: '80% 66.666%', is_enabled: true },

        // Braços
        { id: 'ex_b_1', area_id: 'a_b1', nome: 'Curl Bíceps', nivel: 'Iniciante', sets_reps: '3x 12', duracao_minutos: 4, sprite_pos: '60% 0%', is_enabled: true },
        { id: 'ex_b_2', area_id: 'a_b2', nome: 'Apoios Fechados', nivel: 'Intermediário', sets_reps: '3x 12', duracao_minutos: 4, sprite_pos: '60% 66.666%', is_enabled: true },

        // Pernas
        { id: 'ex_q_1', area_id: 'a_q1', nome: 'Agachamento Livre', nivel: 'Intermediário', sets_reps: '4x 15', duracao_minutos: 6, sprite_pos: '0% 100%', is_enabled: true },
        { id: 'ex_po_1', area_id: 'a_po1', nome: 'Romanian Deadlift', nivel: 'Intermediário', sets_reps: '4x 12', duracao_minutos: 5, sprite_pos: '60% 100%', is_enabled: true },
        { id: 'ex_g_1', area_id: 'a_g1', nome: 'Ponte de Glúteos', nivel: 'Iniciante', sets_reps: '4x 15', duracao_minutos: 4, sprite_pos: '40% 100%', is_enabled: true },
        { id: 'ex_pa_1', area_id: 'a_pa1', nome: 'Elevação de Gémeos', nivel: 'Iniciante', sets_reps: '4x 20', duracao_minutos: 3, sprite_pos: '80% 100%', is_enabled: true },

        // Abdominais -> Renomeado e organizado
        { id: 'ex_ab_1', area_id: 'a_ab1', nome: 'Crunches / Encolhimentos', nivel: 'Iniciante', sets_reps: '3x 20', duracao_minutos: 4, sprite_pos: '0% 33.333%', is_enabled: true },
        { id: 'ex_ab_2', area_id: 'a_ab2', nome: 'Elevação de Pernas', nivel: 'Intermediário', sets_reps: '3x 15', duracao_minutos: 5, sprite_pos: '40% 33.333%', is_enabled: true },
        { id: 'ex_ab_3', area_id: 'a_ob2', nome: 'Prancha Isométrica', nivel: 'Intermediário', sets_reps: '3x 45s', duracao_minutos: 4, sprite_pos: '20% 33.333%', is_enabled: true },
        { id: 'ex_ob_1', area_id: 'a_ob1', nome: 'Prancha Lateral Dir/Esq', nivel: 'Avançado', sets_reps: '3x 45s', duracao_minutos: 4, sprite_pos: '60% 33.333%', is_enabled: true },

        // Cardio e Mobilidade
        { id: 'ex_ca_1', area_id: 'a_ca1', nome: 'Burpees Escalados', nivel: 'Avançado', sets_reps: '5x 1 min', duracao_minutos: 8, sprite_pos: '20% 33.333%', is_enabled: true },
        { id: 'ex_ca_2', area_id: 'a_ca1', nome: 'Jumping Jacks', nivel: 'Iniciante', sets_reps: '4x 2 mins', duracao_minutos: 10, sprite_pos: '20% 33.333%', is_enabled: true },
        { id: 'ex_ca_3', area_id: 'a_ca2', sprint_pos: '', nome: 'Corrida Estacionária', nivel: 'Intermediário', sets_reps: '3x 5 mins', duracao_minutos: 15, sprite_pos: '0% 100%', is_enabled: true },
        { id: 'ex_mo_1', area_id: 'a_mo1', nome: 'Rotações Canivete', nivel: 'Iniciante', sets_reps: '2x 10 rep', duracao_minutos: 4, sprite_pos: '80% 33.333%', is_enabled: true }
    ]
};

        const ExerciciosCardCustom`;
content = content.replace(regexTreinoMock, mockDataFull);

// Update Anatomy Div to use Invert/HueRotate trick and Scale
const imgRegex = /<div style=\{\{\s*width: '100%',\s*height: '100%',\s*backgroundSize: '600% 400%',\s*backgroundRepeat: 'no-repeat',\s*backgroundImage: 'url\("muscles\.png"\)',\s*backgroundPosition: ex\.sprite_pos[^>]*><\/div>/m;
const anatomyDivBetter = `<div style={{ width: '100%', height: '100%', backgroundSize: '600% 400%', backgroundRepeat: 'no-repeat', backgroundImage: 'url("muscles.png")', backgroundPosition: ex.sprite_pos, filter: 'invert(1) hue-rotate(180deg) brightness(1.2)', transform: 'scale(1.4)' }}></div>`;
content = content.replace(imgRegex, anatomyDivBetter);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Update Script Cardio + Abs + Edição Foto Success');
