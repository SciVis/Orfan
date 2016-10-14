# Orfan
## Open Repository for Academic kNowledge

Orfan is a data storage system. The system has a simple structure, all the dataset are stored in a folder structure, with potential sub folders, where each dataset is in one folder. The dataset folder has to contain one "meta.json" file (further descried below) that has the relevant meta data of the data set. This folder structure is then automatically scraped using the orfan.py script to generate a data.js file that is then used by a web page to produce a searchable web page of all the datasets.

In our setup all the datasets are located under the "data" folder and the searchable web page in is found in html/index.html.

# How to add a new dataset
 * Create a folder with the dataset inside the "data" folder. Preferable in one of the subdirectories. 
 * Add representative thumbnails to the dataset folder
 * Copy the "meta.json" template file from the root to the new folder
 * Fill in all the relevant information.

# Meta data
The "meta.json" file contains a list of meta data that we have considered useful. Some is required and some are optional.

 * __name__ (required) A name of the dataset, try and be descriptive.
 * __origin__ (required) Entity or Person that has created/published the dataset.
 * __license__ (required) How are you allowed to use the dataset.
 * __contact__ (required) Our contact person / the person that added the dataset.
 * __tags__ (required) A list of descriptive that for the dataset. First try and use existing tags before adding new ones.
 * __description__ Information about the dataset.
 * __link__ A link to the origin if available.
 * __notes__ Other relevant information.
 * __software__ A lost of software that can be used to open the dataset. A special "software.json" file is located in the "data" folder that describe different softwares in more detail. In this list we just reefer to items in that file.
 * __acknowledgements__ A explanation of what you should to acknowledge the creators of the dataset in the case that you use it. For example add something to the acknowledgements section of the paper, or cite this articles. 
 * __citations__ A list of papers that use this dataset. Note this is not the papers that you should site for acknowledgements, they are in the acknowledgements section. A citation contains a __type__ which can be either "plain", "DOI", or "BibTex". And a __payload__ holding the actual citation. 
 * __thumbnails__ (at least one required) A list of thumbnails for the dataset. A thumbnail contains a __filename__ and a __caption__. 
 * __files__ A list of the relevant files in the dataset. A item in the file list contains
    * __name__ (required) The file name. This can be a pattern including wildcards to match multiple files at the same time. For example "dataset-???.dat" can be used to match a series of files. The supported wildcards can be found at https://docs.python.org/3/library/glob.html. This can also be list of names / pattern. The complete list of matched files will be expanded automatically.
    * __description__ (required) information about the file.
    * __format__ data format.
    * __resolution__ resolution of the dataset of available.
    * __tags__ list of that for that file
