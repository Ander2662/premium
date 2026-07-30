$destinos = @('barcelona', 'valeta', 'santorini', 'kusadasi', 'mykonos', 'atenas')
$basePath = 'c:\Proyectos\I+D\crucero-premium\public\photos'

foreach ($dest in $destinos) {
  $path = "$basePath\$dest"
  $sorted = @(Get-ChildItem "$path\*.jpg" | Sort-Object Length -Descending)
  
  if ($sorted.Count -ge 2) {
    Copy-Item $sorted[0].FullName "$path\1.jpg" -Force
    Copy-Item $sorted[1].FullName "$path\2.jpg" -Force
    Write-Host "$dest - OK (fotos: $($sorted[0].Name), $($sorted[1].Name))"
  }
}

Write-Host "`n✓ Proceso completado"
