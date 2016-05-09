import json
from htmlgen import Document, Division

def ParseCollection(info):
    div = Division()
    div.add_css_classes('dataset')

    Values = [
        'path', 'name', 'license', 'contact',
        'description', 'acknowledgements', 
    ]

    div.append(createPlainElement('path', info))
    div.append(createPlainElement('name', info))
    div.append(createPlainElement('license', info))
    div.append(createPlainElement('description', info))
    div.append(createPlainElement('acknowledgements', info))
    div.append(createTagElements(info))
    div.append(createFileElements(info))

    return div

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

def createThumbnails(info):
    div = Division()
    div.add_css_classes('dataset-files')
    


def generate(meta):
    doc = Document()

    for key, value in meta.items():
        value['path'] = key
        d = ParseCollection(value)
        doc.append_body(d)

    return doc