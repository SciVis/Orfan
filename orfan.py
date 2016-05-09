import argparse
import json
import orfan.scraper
import orfan.generator


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Orfan manager",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument('-p', '--path', type=str, required=True, action="store", dest="path",
                        help='Path to data storage')

    parser.add_argument('-d', '--dest', type=str, required=True, action="store", dest="dest",
                       help='Destination of dataset gallery')

    args = parser.parse_args()
    meta = orfan.scraper.scrape(args.path)
    html = orfan.generator.generate(meta)

    with open(args.dest, 'w') as f:
        f.write(str(html))
    print(html)
