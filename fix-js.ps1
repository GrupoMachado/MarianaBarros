//('fs');
let file = fs.readFileSync('index.html', 'utf8');

// The file got messed up. Let's find exactly where T06 ends.
const t06 = `description: "CombinaÃ§Ã£o mÃ¡xima de movimentos acelerados para hipertrofia e queima calÃ³rica." },`;

let parts = file.split(t06);
if (parts.length < 2) {
    console.log("Could not find T06. Looking for something else...");
} else {
    let header = parts[0] + t06 + "\n";
    // Everything after T06 must be replaced with the cleanly generated ones to ensure no mistakes.
    let footer_start = parts[1].indexOf('];');
    let footer = parts[1].substring(footer_start);

    // Let's generate the 50 INF exercises
    const inf_thumbs = [
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1508215885820-4585e56135c8?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop"
    ];

    const inf_vids = [
        "https://www.youtube.com/embed/nmXu5SSv5Qs",
        "https://www.youtube.com/embed/cR9fZk8JaKY",
        "https://www.youtube.com/embed/1RSDTxVsxiE"
    ];

    const inf_moves = [
        ["Agachamento Livre", "Pise no elÃ¡stico, posicione na altura dos ombros e agache profundamente."],
        ["Agachamento SumÃ´", "PÃ©s bem afastados, pise no elÃ¡stico e agache com Ãªnfase na parte interna da coxa."],
        ["Agachamento BÃºlgaro", "Pise no elÃ¡stico com a perna da frente e apoie a de trÃ¡s. DesÃ§a e suba controladamente."],
        ["Stiff (Deadlift)", "Pernas levemente flexionadas, pise no elÃ¡stico e incline o tronco Ã  frente empurrando o quadril."],
        ["Levantamento Terra Romeno", "Semelhante ao Stiff, descendo o elÃ¡stico rente Ã s coxas focando nos Ã­squiotibiais."],
        ["ElevaÃ§Ã£o PÃ©lvica Solo", "Deitado de barriga para cima, banda acima dos joelhos e eleve o quadril."],
        ["ElevaÃ§Ã£o PÃ©lvica Unilateral", "Apenas uma perna apoiada, elevando o quadril mantendo a tensÃ£o na banda."],
        ["Passada Frontal (Lunge)", "Pise no elÃ¡stico com o pÃ© da frente, segure as pontas e flexione os joelhos."],
        ["Passada Cruzada (Curtsy)", "Pise no elÃ¡stico e desÃ§a cruzando a perna livre por trÃ¡s, ativando glÃºteo mÃ©dio."],
        ["GlÃºteo 4 Apoios", "Em 4 apoios, com banda nos tornozelos, estenda a perna para cima e para trÃ¡s."]
    ];

    const inf_vars = [
        ["com Mini Band", "Iniciante", "3", "12-15", "45s"],
        ["com Super Band", "IntermediÃ¡rio", "4", "10-12", "60s"],
        ["com Tubo ElÃ¡stico", "IntermediÃ¡rio", "3", "15", "45s"],
        ["com Pausa de Isometria", "AvanÃ§ado", "4", "10", "60s"],
        ["Pulsante (Mini Band)", "AvanÃ§ado", "4", "20", "45s"]
    ];

    let items = [];
    let idCount = 51;
    let index = 0;

    for (let m of inf_moves) {
        for (let v of inf_vars) {
            let thumbUrl = inf_thumbs[index % inf_thumbs.length];
            let vidUrl = inf_vids[index % inf_vids.length];
            let title = m[0] + ' ' + v[0];
            let obj = `            { id: 'INF${idCount.toString().padStart(3, '0')}', title: "${title}", category: "Membros Inferiores", difficulty: "${v[1]}", thumbnail: "${thumbUrl}", videoUrl: "${vidUrl}", sets: "${v[2]}", reps: "${v[3]}", rest: "${v[4]}", description: "${m[1]}" }`;
            items.push(obj);
            idCount++;
            index++;
        }
    }

    // SUP 
    const sup_thumbs = [
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1598971639058-fab354c622fb?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop"
    ];
    const sup_vids = [
        "https://www.youtube.com/embed/j9KCjIBCG8k",
        "https://www.youtube.com/embed/zBCmrm5VArc",
        "https://www.youtube.com/embed/XDr7qoxL1yg"
    ];
    const sup_moves = [
        ["Remada Curvada", "Incline o tronco Ã  frente, pise no elÃ¡stico e puxe as mÃ£os em direÃ§Ã£o Ã  cintura."],
        ["Remada Unilateral", "Apoie uma mÃ£o, pise no elÃ¡stico e puxe com o outro braÃ§o rente ao corpo."],
        ["Puxada Alta", "Prenda o elÃ¡stico acima da cabeÃ§a e puxe em direÃ§Ã£o ao peito."],
        ["Supino Reto", "Passe o elÃ¡stico pelas costas e empurre para a frente estendendo os braÃ§os."],
        ["Crucifixo", "Prenda o elÃ¡stico nas costas, abra os braÃ§os e junte as mÃ£os Ã  frente."],
        ["FlexÃ£o de BraÃ§os Resistida", "Passe o elÃ¡stico leve pelas costas e segure nas mÃ£os enquanto executa a flexÃ£o."],
        ["Desenvolvimento de Ombros", "Pise no elÃ¡stico, traga as mÃ£os aos ombros e empurre para cima da cabeÃ§a."],
        ["ElevaÃ§Ã£o Lateral", "Pise na band com os pÃ©s juntos e levante os braÃ§os lateralmente atÃ© a linha dos ombros."],
        ["ElevaÃ§Ã£o Frontal", "Pise na band e levante os braÃ§os esticados para frente mantendo o peito alto."],
        ["Face Pull", "Prenda o elÃ¡stico na altura dos olhos e puxe em direÃ§Ã£o ao rosto separando as mÃ£os."]
    ];

    idCount = 51;
    index = 0;
    for (let m of sup_moves) {
        for (let v of inf_vars) {
            let thumbUrl = sup_thumbs[index % sup_thumbs.length];
            let vidUrl = sup_vids[index % sup_vids.length];
            let title = m[0] + ' ' + v[0];
            let obj = `            { id: 'SUP${idCount.toString().padStart(3, '0')}', title: "${title}", category: "Membros Superiores", difficulty: "${v[1]}", thumbnail: "${thumbUrl}", videoUrl: "${vidUrl}", sets: "${v[2]}", reps: "${v[3]}", rest: "${v[4]}", description: "${m[1]}" }`;
            items.push(obj);
            idCount++;
            index++;
        }
    }

    // ARM 
    const arm_thumbs = [
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1598971639058-fab354c622fb?w=600&h=400&fit=crop"
    ];
    const arm_vids = [
        "https://www.youtube.com/embed/Fa9UTrrxwH8",
        "https://www.youtube.com/embed/XDr7qoxL1yg"
    ];
    const arm_moves = [
        ["Rosca Direta", "Pise no elÃ¡stico. Segure as pontas com as palmas para cima e flexione os cotovelos."],
        ["Rosca Martelo", "Pegada neutra (palmas viradas uma para a outra). Puxada mantendo cotovelos fixos."],
        ["Rosca Concentrada", "Apoie o cotovelo na coxa. Puxe e contraia isolando o bÃ­ceps."],
        ["Rosca Invertida", "Segure o elÃ¡stico com as palmas da mÃ£o para baixo focando nos antebraÃ§os."],
        ["Curl Aranha", "Incline o tronco, deixe os braÃ§os pendendo e flexione os cotovelos verticalmente."],
        ["TrÃ­ceps Coice", "Incline o tronco, alinhe o cotovelo Ã s costas e estenda o braÃ§o para trÃ¡s."],
        ["ExtensÃ£o TrÃ­ceps Overhead", "Passe a tensÃ£o por trÃ¡s das costas e estenda os braÃ§os ao teto."],
        ["TrÃ­ceps Testa", "Deitado, prenda a band atrÃ¡s da cabeÃ§a e estenda os braÃ§os para cima."],
        ["TrÃ­ceps Pulldown", "Fixe num ponto alto, puxe a band para baixo mantendo os cotovelos fixos."],
        ["FlexÃ£o Diamante", "Apoie as mÃ£os juntas formando um diamante, tensionando um elÃ¡stico ao redor dos braÃ§os."]
    ];

    idCount = 51;
    index = 0;
    for (let m of arm_moves) {
        for (let v of inf_vars) {
            let thumbUrl = arm_thumbs[index % arm_thumbs.length];
            let vidUrl = arm_vids[index % arm_vids.length];
            let title = m[0] + ' ' + v[0];
            let obj = `            { id: 'B${idCount.toString().padStart(3, '0')}', title: "${title}", category: "BraÃ§os", difficulty: "${v[1]}", thumbnail: "${thumbUrl}", videoUrl: "${vidUrl}", sets: "${v[2]}", reps: "${v[3]}", rest: "${v[4]}", description: "${m[1]}" }`;
            items.push(obj);
            idCount++;
            index++;
        }
    }

    let code = items.join(',\n') + '\n        ' + footer;
    let newFile = header + code;
    fs.writeFileSync('index.html', newFile, 'utf8');
    console.log("Successfully rebuilt array with " + items.length + " items!");
}
