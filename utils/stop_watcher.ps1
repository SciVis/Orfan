# Based on http://superuser.com/questions/226828/how-to-monitor-a-folder-and-trigger-a-command-line-action-when-a-file-is-created

Unregister-Event $changed.Id
Unregister-Event $created.Id
Unregister-Event $deleted.Id
Unregister-Event $renamed.Id