import json
from htmlgen import Document, Division, Image

def ParseCollection(info):
    div = Division()
    div.add_css_classes('dataset')

    div.append(createPlainElement('path', info))
    div.append(createPlainElement('name', info))
    div.append(createPlainElement('license', info))
    div.append(createPlainElement('description', info))
    div.append(createPlainElement('acknowledgements', info))
    div.append(createTagElements(info))
    div.append(createFileElements(info))
    div.append(createThumbnailElements(info))
    div.append(createSoftwareElements(info))

    return div

####################################################################################
####################################################################################
####################################################################################

def createPlainElement(type, info):
    div = Division()
    div.add_css_classes('dataset-' + type)

    div.append(info[type])

    return div

def createTagElements(info):
    div = Division()
    div.add_css_classes('dataset-tags')

    tags = info['tags']
    for t in tags:
        d = Division()
        d.add_css_classes('dataset-tag')
        d.id = t
        d.append(t)
        div.append(d)

    return div

def createFileElements(info):
    div = Division()
    div.add_css_classes('dataset-files')

    files = info['files']
    for file in files:
        d = Division()
        d.add_css_classes('dataset-file')
        
        # Name
        nameDiv = Division()
        nameDiv.add_css_classes('dataset-file-name')
        nameDiv.append(file['name'])
        d.append(nameDiv)

        # Description
        descDiv = Division()
        descDiv.add_css_classes('dataset-file-description')
        descDiv.append(file['description'])
        d.append(descDiv)

        # Format
        formatDiv = Division()
        formatDiv.add_css_classes('dataset-file-format')
        formatDiv.append(file['format'])
        d.append(formatDiv)

        # Resolution
        resolutionDiv = Division()
        resolutionDiv.add_css_classes('dataset-file-resolution')
        resolutionDiv.append(str(file['resolution']))
        d.append(resolutionDiv)

        div.append(d)

    return div

def createThumbnailElements(info):
    div = Division()
    div.add_css_classes('dataset-thumbnails')

    thumbnails = info['thumbnails']

    for thumbnail in thumbnails:
        d = Division()
        d.add_css_classes('dataset-thumbnail')

        # Image
        image = Image(thumbnail['name'], thumbnail['caption'])
        d.append(image)

        # Name
        nameDiv = Division()
        nameDiv.add_css_classes('dataset-thumbnail-name')
        nameDiv.append(thumbnail['name'])
        d.append(nameDiv);

        # Caption
        captionDiv = Division()
        captionDiv.add_css_classes('dataset-thumbnail-caption')
        captionDiv.append(thumbnail['caption'])
        d.append(captionDiv)

        div.append(d)

    return div

def createSoftwareElements(info):
    div = Division()
    div.add_css_classes('dataset-softwares')

    softwares = info['software']
    for software in softwares:
        d = Division()
        d.add_css_classes('dataset-software')

        allSoftwares = info['allSoftwares']

        s = allSoftwares[software]

        # Name
        nameDiv = Division()
        nameDiv.add_css_classes('dataset-software-name')

        nameDiv.append(s['name'])
        d.append(nameDiv)

        # URL
        urlDiv = Division()
        urlDiv.add_css_classes('dataset-software-url')

        urlDiv.append(s['url'])
        d.append(urlDiv)

        div.append(d)

    return div

####################################################################################
####################################################################################
####################################################################################

def generate(meta, software):
    doc = Document()

    for key, value in meta.items():
        value['path'] = key
        value['allSoftwares'] = software
        d = ParseCollection(value)
        doc.append_body(d)

    return doc