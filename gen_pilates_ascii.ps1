$htmlFile = ".\index.html"

$verbs = @("Estabilizacao de", "Dinamica de", "Rolamento de", "Extensao de", "Alongamento de", "Elevacao de", "Rotacao de", "Articulacao de")
$nouns = @("Core", "Coluna", "Pelve", "Lombar", "Cervical", "Membros", "Powerhouse", "Quadris")
$focus = @("com Foco na Respiracao", "para Controlo", "no Tapete", "com Fluidez", "para Postura", "Classico Adaptado", "com Estabilidade")

$prep = @(
    "1. Deite-se de costas com os joelhos dobrados e pelve neutra.",
    "1. Posicione-se em prancha, ativando firmemente o centro.",
    "1. Sente-se com as pernas esticadas e coluna perfeitamente ereta.",
    "1. Deite-se de barriga para baixo, com as maos ao lado dos ombros.",
    "1. Posicione-se de lado, alinhando ombros, ancas e calcanhares."
)
$exec = @(
    "2. Inspire para preparar e expire ao executar o movimento com maximo controlo.",
    "2. Articule a coluna vertebra por vertebra, sem usar impulso ou balanco.",
    "2. Mantenha a estabilidade pelvica enquanto move as extremidades com fluidez.",
    "2. Aprofunde a contracao abdominal durante a fase de esforco.",
    "2. Alongue a coluna ao maximo, focando na expansao toracica."
)
$safe = @(
    "3. Mantenha os ombros relaxados e longe das orelhas a todo o momento.",
    "3. Se sentir a lombar, reduza a amplitude do movimento imediatamente.",
    "3. Nao force o alongamento; concentre-se na forma e no controlo.",
    "3. Mantenha a cervical alinhada com o resto da coluna, sem tensao.",
    "3. Respire continuamente e nunca bloqueie o fluxo de ar."
)

$content = ""
for ($i = 16; $i -le 200; $i++) {
    $id = "EXT-P" + $i.ToString("D2")
    $title = $($verbs | Get-Random) + " " + $($nouns | Get-Random) + " " + $($focus | Get-Random)
    
    $descPrep = $($prep | Get-Random)
    $descExec = $($exec | Get-Random)
    $descSafe = $($safe | Get-Random)
    $desc = "$descPrep $descExec $descSafe"
    
    $sets = (2, 3) | Get-Random
    $repsNum = (6, 8, 10, 12, 15) | Get-Random
    $repsStr = "$repsNum"
    if ((Get-Random -Maximum 10) -gt 6) { $repsStr += " cada lado" }
    
    $rest = ("30s", "45s") | Get-Random
    $diff = ("Iniciante", "Intermediario", "Avancado") | Get-Random
    
    $line = "            { id: '$id', title: `"$title`", category: `"Pilates`", difficulty: `"$diff`", premium: true, moduleId: 'pilates', videoUrl: `"`", sets: `"$sets`", reps: `"$repsStr`", rest: `"$rest`", description: `"$desc`" }"
    if ($i -lt 200) { $line += "," }
    $content += $line + "`r`n"
}

# Now inject into HTML safely
$htmlLines = Get-Content $htmlFile -Raw -Encoding UTF8
$targetStr = "{ id: 'EXT-P15'"

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
        Write-Host "Success injecting Pilates."
    }
    else {
        Write-Host "Could not find ];"
    }
}
else {
    Write-Host "Could not find EXT-P15"
}
