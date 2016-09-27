import os
import json


def scrape(path):
    prefix = os.path.abspath(path)
    result = {}
    for root, dirs, files in os.walk(path, topdown=True, onerror=None, followlinks=True):
        if "meta.json" in files:
            metafile = os.path.join(root, "meta.json")
            if os.path.exists(metafile):
                with open(metafile) as f:
                    pathname = os.path.relpath(root, prefix).replace(os.sep, '/')
                    result[pathname] = json.load(f)
                    dirs.clear() # stop recursive search when we found a meta file.
    return result

