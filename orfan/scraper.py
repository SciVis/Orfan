import os
import json


def scrape(paths):
    result = {}
    for root, dirs, files in os.walk(".", topdown=True, onerror=None, followlinks=True):
        if "meta.json" in files:
            metafile = os.path.join(root, "meta.json")
            if os.path.exists(metafile):
                with open(metafile) as f:
                    result[root] = json.load(f)
                    dirs.clear() # stop recursive search when we found a meta file.
    return result

