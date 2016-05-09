import argparse
import json
import orfan.scraper
import orfan.generator
import os


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Orfan manager",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument('-p', '--path', type=str, nargs=1, action="store", dest="path",
                        help='Path to data storage')

    args = parser.parse_args()

    if args.path == None:
        args.path = "./Example"

    meta = orfan.scraper.scrape(args.path)

    with open(os.path.join(args.path, 'software.json')) as f:
        software = json.load(f)
    html = orfan.generator.generate(meta, software)

    with open('/Users/alex/Desktop/test.html', 'w') as f:
        f.write(str(html))
    print(html)
