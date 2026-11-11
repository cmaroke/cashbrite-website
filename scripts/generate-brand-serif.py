"""Export DM Serif Display outlines; existing site logos are not touched."""
from pathlib import Path
import argparse
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('font', help='Path to the licensed DMSerifDisplay-Regular.ttf source')
args = parser.parse_args()
font = TTFont(args.font)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
root = Path('public/brand/v2')

def outlines(text, spacing=0):
    parts, x = [], 0
    for char in text:
        name = cmap[ord(char)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        parts.append(f'<path transform="translate({x} 0)" d="{pen.getCommands()}"/>')
        x += glyphs[name].width + spacing
    return ''.join(parts), x - spacing

def wordmark(name, colour, spacing=0):
    paths, width = outlines('cashbrite', spacing)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -40 {width+300} 820" role="img" aria-label="cashbrite"><g fill="{colour}" transform="translate(0 720) scale(1 -1)">{paths}</g><circle cx="{width+115}" cy="660" r="65" fill="#C7F36B"/></svg>'
    (root/name).write_text(svg+'\n')

wordmark('wordmark.svg', '#0F2A3A')
wordmark('wordmark-white.svg', '#FFFFFF')
wordmark('wordmark-compact.svg', '#0F2A3A', 8)
paths, width = outlines('C')
for name, colour, background in [('mark.svg','#0F2A3A',None),('favicon-light.svg','#0F2A3A','#F7F4EC'),('favicon-dark.svg','#FFFFFF','#0F2A3A')]:
    bg = f'<rect width="1000" height="1000" rx="160" fill="{background}"/>' if background else ''
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-label="Cashbrite C monogram">{bg}<g fill="{colour}" transform="translate(125 805) scale(.85 -.85)">{paths}</g><circle cx="810" cy="750" r="85" fill="#C7F36B"/></svg>'
    (root/name).write_text(svg+'\n')
