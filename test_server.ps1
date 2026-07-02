try {
    # Start the Django server
    $server = Start-Process -FilePath "backend_cultivos\venv\Scripts\python.exe" -ArgumentList "manage.py", "runserver", "0.0.0.0:8000" -WorkingDirectory "backend_cultivos" -RedirectStandardOutput "server.out.log" -RedirectStandardError "server.err.log" -WindowStyle Hidden -PassThru
    Write-Output "Server started with PID: $($server.Id)"
    Start-Sleep -Seconds 10
    # Try to curl the login endpoint
    $curlResult = curl -v http://localhost:8000/api/login/ 2>&1
    Write-Output "Curl result:"
    Write-Output $curlResult
    # Stop the server
    Stop-Process -Id $server.Id
    Write-Output "Server stopped."
} catch {
    Write-Output "Error: $($_.Exception.Message)"
}