import argparse
import json
import orfan.scraper


if __name__ == '__main__':
	parser = argparse.ArgumentParser(
		description="Orfan manager",
		formatter_class=argparse.ArgumentDefaultsHelpFormatter
	)
	parser.add_argument('-p', '--path', type=str, nargs=1, action="store", dest="path",
						help='Path to data storage')

	args = parser.parse_args()
	meta = orfan.scraper.scrape(args.path)

	print(json.dumps(meta, indent=4, separators=(',', ': ')))
