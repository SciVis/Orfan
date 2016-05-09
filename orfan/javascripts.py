import pkgutil
import os

def writeScript(path, script):
    data = pkgutil.get_data('orfan', 'resources/' + script)
    with open(os.path.join(path, script), 'wb') as f:
        f.write(data)