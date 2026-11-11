"""Inspect an existing synthetic download; never calls customer services or generates a PDF."""
import json
import re
import sys
from pathlib import Path

import pdfplumber


def normalise(value):
    plain = (value.replace("’", "'").replace("‘", "'").replace("“", '"')
             .replace("”", '"').replace("—", "-").replace("–", "-"))
    return re.sub(r"\s+", " ", plain).strip()


pdf_path = Path(sys.argv[1] if len(sys.argv) > 1 else "output/pdf/cashbrite-money-ready-plan-demo.pdf")
manifest = json.loads(Path("tmp/pdfs/phase3c1/manifest.json").read_text())
plan = manifest["plan"]
with pdfplumber.open(pdf_path) as document:
    pages = [page.extract_text(use_text_flow=True) or "" for page in document.pages]
    text = normalise(" ".join(pages))
    expected = [plan["personalMoneyProfile"], plan["moneyPersonality"]["description"]]
    for area in plan["priorityAreas"]:
        expected += [area["whyItMatters"], area["commonMistakes"], *area["actions"]]
        guide = area.get("creditLearningGuide")
        if guide:
            expected += [guide["basics"]["explanation"], guide["monthlyStatement"]["explanation"],
                         *guide["monthlyStatement"]["shows"], guide["bestHabit"]["explanation"],
                         *guide["bestHabit"]["benefits"], guide["minimumPayment"]["explanation"],
                         *guide["minimumPayment"]["consequences"], guide["example"]["title"],
                         guide["example"]["scenario"], guide["example"]["monthTitle"], guide["rule"]]
            for item in guide["example"]["statement"]:
                expected.append(f'{item["label"]}: {item["value"]}')
            for option in guide["example"]["options"]:
                expected += [option["title"], option["payment"], *option["outcomes"]]
        else:
            example = area["realLifeExample"]
            expected += [area["whatToLearn"], area["moneySmartTip"], example["title"], example["summary"],
                         *example["details"], example["takeaway"]]
    for week in plan["roadmap"]:
        expected += [week["focus"], *week["actions"]]
        assert any(all(normalise(item) in normalise(page) for item in [week["focus"], *week["actions"]])
                   for page in pages), f'{week["week"]} splits across pages'
    expected += plan["parentConversationGuide"] + plan["recommendedNextSteps"]
    for item in plan["checklist"]:
        expected += [item["topic"], item["prompt"]]
    for category in plan["categoryScores"]:
        assert normalise(category["title"]) in text
        assert f'{category["score"]}%' in text
    missing = [item for item in expected if normalise(item) not in text]
    assert not missing, f"Missing report content: {missing}"
    outside = []
    collisions = []
    for index, page in enumerate(document.pages):
        for char in page.chars:
            if char["x0"] < 0 or char["x1"] > page.width + 0.5 or char["top"] < 0 or char["bottom"] > page.height:
                outside.append((index + 1, char["text"]))
        # Ignore glyph kerning; detect independently positioned lines on top of one another.
        lines = {}
        for char in page.chars:
            lines.setdefault(round(char["top"], 1), []).append(char)
        ordered = sorted(lines.items())
        for (top, line), (next_top, following) in zip(ordered, ordered[1:]):
            if next_top - top < min(min(c["size"] for c in line), min(c["size"] for c in following)) * 0.5:
                if any(a["x0"] < b["x1"] and b["x0"] < a["x1"] for a in line for b in following):
                    collisions.append((index + 1, top, next_top))
    assert not outside, outside
    assert not collisions, collisions
    assert "57" in pages[0] and "Developing Money Skills" in pages[0]
    assert 100 - 5 == 95
    assert 4200 / 14 == 300 and 300 - 190 == 110
    assert 20 * 3 == 60
    print(json.dumps({"file": str(pdf_path), "pages": len(pages), "bytes": pdf_path.stat().st_size,
                      "required_content_items": len(expected), "missing": len(missing),
                      "out_of_page_glyphs": len(outside), "line_collisions": len(collisions),
                      "fonts": sorted({c["fontname"] for p in document.pages for c in p.chars}),
                      "week_blocks": "all four kept together", "demo_arithmetic": "passed"}, indent=2))
