$existing = Get-Process python -ErrorAction SilentlyContinue | Where-Object {
    (Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)").CommandLine -match 'node_registry_watcher'
}
if ($existing) {
    $existing | Stop-Process -Force
    Start-Sleep 2
}
& 'C:\Python314\python.exe' 'C:\Users\Gillsystems Laptop\source\repos\OCNGill\gillsystems.net\scripts\node_registry_watcher.py'
