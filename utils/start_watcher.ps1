# Based on http://superuser.com/questions/226828/how-to-monitor-a-folder-and-trigger-a-command-line-action-when-a-file-is-created

# Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process

### SET FOLDER TO WATCH + FILES TO WATCH + SUBFOLDERS YES/NO
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "T:\orfan\data"
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true  

### DEFINE ACTIONS AFTER A EVENT IS DETECTED
$action = { $path = $Event.SourceEventArgs.FullPath
            $changeType = $Event.SourceEventArgs.ChangeType
            $logline = "$(Get-Date), $changeType, $path"
            Add-content ".\log.txt" -value $logline
            $log = "$(python.exe T:\orfan\orfan.py -p T:\orfan\data -d T:\orfan\html)"
            Add-content ".\log.txt" -value $log
          }
### DECIDE WHICH EVENTS SHOULD BE WATCHED + SET CHECK FREQUENCY  
$created = Register-ObjectEvent $watcher "Created" -Action $action
$changed = Register-ObjectEvent $watcher "Changed" -Action $action
$deleted = Register-ObjectEvent $watcher "Deleted" -Action $action
$renamed = Register-ObjectEvent $watcher "Renamed" -Action $action
while ($true) {sleep 5}