$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

$photoSets = [ordered]@{
  'barcelona' = @(
    'Sagrada Familia, Barcelona (P1170666).jpg',
    'Barcelona. View from Tibidabo.jpg',
    'Barcelona city center.jpg',
    '14-08-05-barcelona-RalfR-022.jpg',
    'Port of Barcelona.jpg',
    'Palau de la Música Catalana-Palace of Catalan Music (Image 2).jpg'
  )
  'navegacion-1' = @()
  'valeta' = @(
    'Fortifications of Valletta.jpg',
    'Grand Harbour engulfed in fog.jpg',
    'La Valletta, Malta (51256092419).jpg',
    'Coast of Valetta.jpg',
    'Gallariji in Valletta, Malta, 2025.jpg',
    'Malta, a view of the Fort St. Angelo and the Grand Harbor at Valletta).jpeg'
  )
  'navegacion-2' = @()
  'santorini' = @(
    'SantoriniPartialPano.jpg',
    'Houses on the caldera, Santorini.jpg',
    'Imerovigli 02.jpg',
    'Santorini cruise ships in caldera.jpg',
    'Firostefani.jpg',
    'ISS017-E-5037 lrg.jpg'
  )
  'kusadasi' = @(
    'Kuşadası Banner.jpg',
    'Kuşadası Coast - panoramio.jpg',
    'Öküz Mehmed Pasha Caravanserai, Kuşadası 02.jpg',
    'Kuşadası 201409301837.jpg',
    'Dilek Yarımadası-Büyük Menderes Deltası Millî Parkı 2013-03-28b.jpg',
    'Davutlar - panoramio (1).jpg'
  )
  'mykonos' = @(
    'Mykonos City.jpg',
    'Against Greek skies, one of the Mykonos Island Windmills, Chora. Cyclades, Agean Sea, Greece.jpg',
    'Little Venice, Mykonos.JPG',
    'The four windmills in Mykonos.JPG',
    'Church of Panagia Paraportiani 01.jpg',
    'Elias Beach on Mykonos.JPG'
  )
  'atenas' = @(
    'The Parthenon in Athens.jpg',
    'The Acropolis Museum as seen from the top of the Acropolis hill.jpg',
    'Athens and Mount Lycabettus from the Areopagus on July 22, 2019.jpg',
    'The Clock Tower of Andronicus Cyrrhestes (Tower of the Winds) on May 19, 2021.jpg',
    'Athenian Agora (3358219222).jpg',
    'The Odeon of Herodes Atticus on September 13, 2020.jpg'
  )
}

$allTitles = $photoSets.Values | ForEach-Object { $_ } | Select-Object -Unique
$apiTitles = ($allTitles | ForEach-Object { 'File:' + $_ }) -join '|'
$apiUrl = 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=' + [uri]::EscapeDataString($apiTitles)
$apiResponse = Invoke-RestMethod -Uri $apiUrl -Headers @{ 'User-Agent' = 'crucero-premium-offline/1.0 (personal project)' }

$urlByTitle = @{}
foreach ($page in $apiResponse.query.pages.PSObject.Properties.Value) {
  if ($page.title -and $page.imageinfo -and $page.imageinfo.Count -gt 0) {
    $title = $page.title -replace '^File:', ''
    $urlByTitle[$title] = $page.imageinfo[0].url
  }
}

foreach ($folder in $photoSets.Keys) {
  $targetDir = Join-Path (Get-Location) (Join-Path 'public/photos' $folder)
  if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
  }

  $index = 1
  foreach ($title in $photoSets[$folder]) {
    if (-not $urlByTitle.ContainsKey($title)) {
      throw "No URL found for title: $title"
    }

    $targetFile = Join-Path $targetDir ($index.ToString() + '.jpg')
    Invoke-WebRequest -Uri $urlByTitle[$title] -OutFile $targetFile -Headers @{ 'User-Agent' = 'crucero-premium-offline/1.0 (personal project)' }
    $index++
  }
}

Get-ChildItem 'public/photos' -Directory | ForEach-Object {
  $count = (Get-ChildItem $_.FullName -File | Measure-Object).Count
  [PSCustomObject]@{ Folder = $_.Name; Files = $count }
} | Sort-Object Folder | Format-Table -AutoSize
