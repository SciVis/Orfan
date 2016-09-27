def dictget(dct, *keys, failure = None):
    for key in keys:
        if key in dct.keys():
            dct = dct[key]
        else: 
            return failure
    return dct