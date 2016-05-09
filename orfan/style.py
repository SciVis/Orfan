import pkgutil
import lesscpy
import io

def writecss(path):
	cssdata = pkgutil.get_data('orfan', 'resources/orfan.less')
	with open(path as f:
			f.write(lesscpy.compile(io.StringIO(cssdata.decode("utf-8"))))