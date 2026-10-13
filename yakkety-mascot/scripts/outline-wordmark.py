"""Regenerate src/wordmark-data.mjs: "yakkety" in Fredoka Bold, as outlines.

Only needed if the lettering changes. Everyday builds use the saved outlines.

    pip install fonttools uharfbuzz
    curl -LO "https://raw.githubusercontent.com/google/fonts/main/ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf"
    python3 scripts/outline-wordmark.py "Fredoka[wdth,wght].ttf"

Fredoka is licensed under the SIL Open Font License 1.1, which allows using it
in a logo.
"""
import math, os, re, sys
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

TEXT = "yakkety"
AXES = {"wght": 700, "wdth": 100}

font_path = sys.argv[1]
inst = instantiateVariableFont(TTFont(font_path), AXES, inplace=False)
gs, order = inst.getGlyphSet(), inst.getGlyphOrder()

hbfont = hb.Font(hb.Face(hb.Blob.from_file_path(font_path)))
hbfont.set_variations(AXES)
buf = hb.Buffer(); buf.add_str(TEXT); buf.guess_segment_properties()
hb.shape(hbfont, buf, {"kern": True, "liga": False})

x, parts, box = 0, [], [1e9, 1e9, -1e9, -1e9]
for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
    glyph = gs[order[info.codepoint]]
    pen = SVGPathPen(gs)
    glyph.draw(TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, -pos.y_offset)))  # font units are y-up
    parts.append(pen.getCommands())
    bp = BoundsPen(gs); glyph.draw(bp); b = bp.bounds
    box = [min(box[0], b[0] + x), min(box[1], b[1]), max(box[2], b[2] + x), max(box[3], b[3])]
    x += pos.x_advance

d = re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.1f}".rstrip("0").rstrip("."), " ".join(parts))
x0, top = math.floor(box[0]), math.floor(-box[3])  # round outward so nothing is clipped
vb = [x0, top, math.ceil(box[2]) - x0, math.ceil(-box[1]) - top]
version = inst["name"].getDebugName(5)
out = f'''// Yakkety wordmark: "{TEXT}" set in Fredoka Bold (wght {AXES["wght"]}, wdth {AXES["wdth"]}, {version.lower()},
// SIL Open Font License 1.1) and converted to outlines, with the font's kerning.
// Regenerate with scripts/outline-wordmark.py if the lettering ever changes.
export const WORDMARK = {{
  viewBox: {vb}, // tight bounds, font units (1000 per em)
  d: "{d}",
}};
'''
dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "wordmark-data.mjs")
open(dest, "w").write(out)
print("wrote", dest)
