$path = ".\index.html"
$content = Get-Content $path -Raw -Encoding UTF8
$fixed = $content -replace "GinÃ¡stica", "Ginástica"
$utf8bom = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText($path, $fixed, $utf8bom)
