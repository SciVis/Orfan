import os
import glob
import json

from . import util

def filesize(path, file):
    return os.path.getsize(os.path.join(path, file))

def expandPattern(path, filepattern):
    files = glob.glob(os.path.join(path, filepattern))
    return [os.path.relpath(f, path) for f in files]

def scrape(path):
    prefix = os.path.abspath(path)
    masterMeta = {}
    thumbs = []
    for root, dirs, files in os.walk(path, topdown=True, onerror=None, followlinks=True):
        if "meta.json" in files:
            metafile = os.path.join(root, "meta.json")
            if os.path.exists(metafile):
                with open(metafile) as f:
                    pathname = os.path.relpath(root, prefix).replace(os.sep, '/')
                    meta = json.load(f)

                    for file in util.dictget(meta, "files", failure = []):
                        file["filelist"] = []
                        if "name" in file.keys():
                            for f in expandPattern(root, file["name"]):
                                file["filelist"].append({"name": f, "size" : filesize(root, f)})

                    for thumb in util.dictget(meta, "thumbnails", failure = []):
                        if "name" in thumb.keys():
                            thumbs.append(os.path.join(pathname, thumb["name"]))

                    masterMeta[pathname] = meta
                    dirs.clear() # stop recursive search when we found a meta file.
    return masterMeta, thumbs

