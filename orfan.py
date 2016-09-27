import argparse
import json
import os
import shutil

missing_modules = {}
try:
    import orfan
except ImportError:
    missing_modules['orfan'] = "main Orfan module missing"

if len(missing_modules)>0: 
    print("Error: Missing python modules:")
    for k,v in missing_modules.items():
        print("    {:20s} {}".format(k,v))    
    print("    To install run: 'pip3 install {}'".format(" ".join(missing_modules.keys())))
    exit()


import orfan.scraper

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

    parser.add_argument('-p', '--path', type=str, action="store", dest="path",
                        help='Path to data storage', default = "./Example")
    parser.add_argument('-d', '--dest', type=str,  action="store", dest="dest",
                       help='Destination dir of dataset gallery', default = "./html" )
    args = parser.parse_args()

    meta, thumbnails = orfan.scraper.scrape(args.path)
    with open(os.path.join(args.path, "software.json")) as f:
        software = json.load(f)

    #if os.path.isdir(args.dest) : shutil.rmtree(args.dest)
    outputDir = mkdir(args.dest)

    with open(os.path.join(outputDir, "data.js"), 'w') as f:
        f.write("var data = ")
        f.write(json.dumps({"datasets" : meta, "software" : software}, indent=4))

    for thumbnail in thumbnails:
        os.makedirs(os.path.dirname(os.path.join(outputDir, "thumbnails", thumbnail)),  exist_ok=True)
        shutil.copyfile(os.path.join(args.path, thumbnail),
                        os.path.join(outputDir, "thumbnails", thumbnail))
