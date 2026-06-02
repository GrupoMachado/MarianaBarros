$content = [IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)

# Categories tracked
$counts = @{}

$pattern = '(\{[\s\S]*?id:\s*[\''"]([^\''"]+)[\''"][\s\S]*?category:\s*[\''"]([^\''"]+)[\''"][\s\S]*?description:\s*[\''"]([^\''"]+)[\''"][\s\S]*?\})'

$newContent = [Regex]::Replace($content, $pattern, {
        param($m)
        $full = $m.Groups[1].Value
        $id = $m.Groups[2].Value
        $cat = $m.Groups[3].Value
        $desc = $m.Groups[4].Value

        if (-not $counts.ContainsKey($cat)) {
            $counts[$cat] = 0
        }
    
        $counts[$cat]++

        if ($counts[$cat] -le 5) {
            if ($desc -notmatch '^\s*1\.') {
                $newDesc = "1. [Preparação] Ajuste a sua postura. 2. [Execução] $desc 3. [Dica de Segurança] Mantenha a forma."
                return $full.Replace("description: `"$desc`"", "description: `"$newDesc`"").Replace("description: '$desc'", "description: '$newDesc'")
            }
        }

        return $full
    })

[IO.File]::WriteAllText("index.html", $newContent, [System.Text.Encoding]::UTF8)
Write-Output "Done"
