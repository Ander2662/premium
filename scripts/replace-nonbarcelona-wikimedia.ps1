$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

$sets = [ordered]@{
  'valeta' = @(
    'Fortifications of Valletta.jpg',
    'Grand Harbour engulfed in fog.jpg',
    'La Valletta, Malta (51256092419).jpg',
    'Coast of Valetta.jpg',
    'Gallariji in Valletta, Malta, 2025.jpg',
    'Malta, a view of the Fort St. Angelo and the Grand Harbor at Valletta).jpeg'
  )
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

$allTitles = $sets.Values | ForEach-Object { $_ } | Select-Object -Unique
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

$failed = @()
$ok = @()

foreach ($folder in $sets.Keys) {
  $dir = Join-Path (Get-Location) (Join-Path 'public/photos' $folder)
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }

  $index = 1
  foreach ($title in $sets[$folder]) {
    if (-not $urlByTitle.ContainsKey($title)) {
      $failed += "MISSING_URL::$folder::$index::$title"
      $index++
      continue
    }

    $targetFile = Join-Path $dir ($index.ToString() + '.jpg')
    $url = $urlByTitle[$title]
    try {
      curl.exe -L --fail --retry 10 --retry-all-errors --retry-delay 4 -A "Mozilla/5.0" "$url" -o "$targetFile" | Out-Null
      $size = (Get-Item $targetFile).Length
      if ($size -le 10000) {
        $failed += "TOO_SMALL::$folder::$index::$title"
      } else {
        $ok += "OK::$folder::$index::$title::$size"
      }
    } catch {
      $failed += "DOWNLOAD_FAIL::$folder::$index::$title"
    }

    $index++
  }
}

"OK_COUNT=$($ok.Count)"
"FAILED_COUNT=$($failed.Count)"
if ($failed.Count -gt 0) {
  "FAILED_LIST"
  $failed
}
