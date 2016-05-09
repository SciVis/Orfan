import pkgutil
import lesscpy
import io

def writeCSS(path):
    cssdata = pkgutil.get_data('orfan', 'resources/orfan.less')
    with open(path, 'w') as f:
        f.write(lesscpy.compile(io.StringIO(cssdata.decode("utf-8"))))