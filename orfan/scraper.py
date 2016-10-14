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
    errors = []

    def error(message):
        errors.append(message)
        print(message)

    for root, dirs, files in os.walk(path, topdown=True, onerror=None, followlinks=True):
        if "meta.json" in files:
            metafile = os.path.join(root, "meta.json")
            if os.path.exists(metafile):
                with open(metafile) as f:
                    pathname = os.path.relpath(root, prefix).replace(os.sep, '/')
                    try:
                        meta = json.load(f)

                        for file in util.dictget(meta, "files", failure = []):
                            file["filelist"] = []
                            if "name" in file.keys():
                                if isinstance(file["name"], str):
                                    for f in expandPattern(root, file["name"]):
                                        file["filelist"].append({"name": f, "size" : filesize(root, f)})
                                else:
                                    for name in file["name"]:
                                        for f in expandPattern(root, name):
                                            file["filelist"].append({"name": f, "size" : filesize(root, f)})

                        validthumbs = []
                        for thumb in util.dictget(meta, "thumbnails", failure = []):
                            if "name" in thumb.keys():
                                if os.path.exists(os.path.join(prefix, pathname, thumb["name"])):
                                    thumbs.append(os.path.join(pathname, thumb["name"]))
                                    validthumbs.append(thumb)
                                else:
                                    error("Error: "  + metafile + ", thumbnail: " + os.path.join(root, pathname, thumb["name"]) + " missing")
                            else: 
                                error("Error: "  + metafile + ", thumbnails tag with missing name")

                        meta["thumbnails"] = validthumbs
                        masterMeta[pathname] = meta
                        dirs.clear() # stop recursive search when we found a meta file.
                    except json.decoder.JSONDecodeError as err:
                        error("Error: " + metafile + ", " + str(err))
    return masterMeta, thumbs, errors

