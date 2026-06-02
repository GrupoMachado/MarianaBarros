$htmlFile = ".\index.html"

$verbs = @("Estabilizacao Gruposa", "Explosao de", "Equilibrio Invertido", "Marcha de", "Apoio de", "Contracao de", "Deslocamento de", "Salto e Aterragem")
$nouns = @("Core", "Quadris", "Ombros", "Tronco", "Cadeia Posterior", "Centro", "Membros Superiores", "Membros Inferiores")
$focus = @("com Foco em Mobilidade", "para Controlo Corporal", "na Parede", "com Maxima Tensao", "para Resistencia", "Classico Adaptado", "com Estabilidade Dinamica")

$prep = @(
    "1. Adote a posicao base de prancha, mantendo o abdome ativado.",
    "1. De pe, alinhe os calcanhares com a largura dos ombros.",
    "1. Sente-se no chao, mantendo a postura o mais ereta possivel.",
    "1. Deite-se em decubito dorsal (costas), pernas estendidas e bracos ao longo do corpo.",
    "1. Posicione-se em quatro apoios, alinhando pulsos com ombros e joelhos com quadris."
)
$exec = @(
    "2. Execute o movimento com explosao, ativando os musculos alvos rapidamente.",
    "2. Sustente a posicao geometrica com alinhamento perfeito sem ceder a gravidade.",
    "2. Transfira o peso alternadamente mantendo o controlo da bacia e do tronco.",
    "2. Articule a forca gerando impulso atraves do calcanhar e nao dos joelhos.",
    "2. Faca o balanco dinamico, absorvendo todo o impacto na descida ou rececao."
)
$safe = @(
    "3. Mantenha os cotovelos travados ou joelhos desbloqueados dependendo da carga.",
    "3. Se sentir a lombar, adapte e traga os joelhos mais para perto do peito.",
    "3. Nao prenda a respiracao; expire firmemente durante o esforco primario.",
    "3. Cuidado redobrado com os pulsos e ombros em posturas invertidas ou de apoio profundo.",
    "3. Priorize a tecnica em vez do numero de repeticoes para evitar lesoes."
)

$content = ""
for ($i = 16; $i -le 200; $i++) {
    $id = "EXT-G" + $i.ToString("D2")
    $title = $($verbs | Get-Random) + " " + $($nouns | Get-Random) + " " + $($focus | Get-Random)
    
    $descPrep = $($prep | Get-Random)
    $descExec = $($exec | Get-Random)
    $descSafe = $($safe | Get-Random)
    $desc = "$descPrep $descExec $descSafe"
    
    $sets = (3, 4, 5) | Get-Random
    $repsNum = (5, 8, 10, 15, 20) | Get-Random
    $repsStr = "$repsNum"
    if ((Get-Random -Maximum 10) -gt 6) { $repsStr += " cada lado" }
    
    $rest = ("45s", "60s", "90s") | Get-Random
    $diff = ("Iniciante", "Intermediario", "Avancado") | Get-Random
    
    $line = "            { id: '$id', title: `"$title`", category: `"Ginástica`", difficulty: `"$diff`", premium: true, moduleId: 'gymnastics', videoUrl: `"`", sets: `"$sets`", reps: `"$repsStr`", rest: `"$rest`", description: `"$desc`" }"
    if ($i -lt 200) { $line += "," }
    $content += $line + "`r`n"
}

# Inject into HTML
$htmlLines = Get-Content $htmlFile -Raw -Encoding UTF8
$targetStr = "{ id: 'EXT-G15'"

$index = $htmlLines.IndexOf($targetStr)
if ($index -gt -1) {
    $endIndex = $htmlLines.IndexOf("];", $index)
    if ($endIndex -gt -1) {
        $before = $htmlLines.Substring(0, $endIndex)
        $after = $htmlLines.Substring($endIndex)
        
        $before = $before.TrimEnd()
        if (-not $before.EndsWith(",")) {
            $before += ","
        }
        $before += "`r`n" + $content + "        "
        $finalHtml = $before + $after
        
        $utf8bom = New-Object System.Text.UTF8Encoding $true
        [System.IO.File]::WriteAllText($htmlFile, $finalHtml, $utf8bom)
        Write-Host "Success injecting Gymnastics."
    }
    else {
        Write-Host "Could not find ];"
    }
}
else {
    Write-Host "Could not find EXT-G15 point"
}
