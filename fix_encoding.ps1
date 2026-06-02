$content = [System.IO.File]::ReadAllText(".\index.html")
$fixed = $content.Replace("GinÃ¡stica", "Ginástica")
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText(".\index.html", $fixed, $utf8NoBom)
