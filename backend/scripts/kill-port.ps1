param([int]$Port = 4000)
$lines = netstat -ano | Select-String ":$Port\s"
foreach ($line in $lines) {
  $parts = ($line -replace '\s+', ' ').Trim().Split(' ')
  $processId = $parts[-1]
  if ($processId -match '^\d+$') {
    Write-Host "Stopping process $processId on port $Port"
    taskkill /PID $processId /F 2>$null
  }
}
Write-Host "Port $Port is free. Run: npm run dev"
