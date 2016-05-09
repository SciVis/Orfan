import pkgutil
import os

def writeScripts(path, scripts):
    for script in scripts:
        data = pkgutil.get_data('orfan', 'resources/' + script)
        with open(os.path.join(path, script), 'wb') as f:
            f.write(data)