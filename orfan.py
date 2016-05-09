import argparse
import json
import os


missing_modules = {}
try:
    import orfan
except ImportError:
    missing_modules['orfan'] = "main Orfan module missing"

try:
    import lesscpy
except ImportError:
    missing_modules['lesscpy'] = "needed for css generation"

try:
    import htmlgen
except ImportError:
    missing_modules['htmlgen'] = "needed for html generation"

if len(missing_modules)>0: 
    print_error("Error: Missing python modules:")
    for k,v in missing_modules.items():
        print_error("    {:20s} {}".format(k,v))    
    print_info("    To install run: 'pip3 install {}'".format(" ".join(missing_modules.keys())))
    exit()


import orfan.scraper
import orfan.generator
import orfan.style

def mkdir(*path):
    res = os.path.join(*path) 
    if not os.path.isdir(res):
        os.mkdir(res)
    return res

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Orfan manager",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    class ConfigFiles:
        css = "orfan.css"
        html = "orfan.html"
        software = "software.json"

    files = ConfigFiles()

    parser.add_argument('-p', '--path', type=str, action="store", dest="path",
                        help='Path to data storage', default = ".")
    parser.add_argument('-d', '--dest', type=str,  action="store", dest="dest",
                       help='Destination dir of dataset gallery', default = "./html" )
    args = parser.parse_args()

    meta = orfan.scraper.scrape(args.path)

    with open(os.path.join(args.path, files.software)) as f:
        software = json.load(f)

    html = orfan.generator.generate(meta, software)

    outputDir = mkdir(args.dest)

    with open(os.path.join(outputDir, files.html), 'w') as f:
        f.write(str(html))

    orfan.style.writeCSS(os.path.join(outputDir, files.css))
