"""
pretty_print.py
"""

from bs4 import BeautifulSoup
from bs4.formatter import HTMLFormatter
import sys


def prettify(fname):
    """___"""
    with open(fname, "r", encoding="utf-8") as f:
        content = f.read()

    soup = BeautifulSoup(content, "html.parser")
    formatter = HTMLFormatter(indent=20)

    pretty_html = soup.prettify(formatter=formatter).replace("/>", ">")

    with open(fname, "w", encoding="utf-8") as f:
        f.write(pretty_html)


if __name__ == "__main__":

    if len(sys.argv) > 1 and "ipykernel_launcher.py" not in sys.argv[0]:
        fname = sys.argv[1]
    else:
        fname = "../public/index.html"
    prettify(fname)
