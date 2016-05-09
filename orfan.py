import argparse
import json
import orfan.scraper
import orfan.generator


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Orfan manager",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument('-p', '--path', type=str, nargs=1, action="store", dest="path",
                        help='Path to data storage')

    args = parser.parse_args()
    meta = orfan.scraper.scrape(args.path)
    html = orfan.generator.generate(meta)

    with open('/Users/alex/Desktop/test.html', 'w') as f:
        f.write(str(html))
    print(html)
