#!/usr/bin/env python3
"""
Build the Darbna training page.

1. Reads every subject spreadsheet in training/source/ (today: english.xlsx)
   and turns it into structured JSON in training/data/<subject>.json.
2. Merges hand-written extras from training/data/<subject>.extra.json
   (rule questions, more explanations) if the file exists.
3. Writes one self-contained page: training/dist/darbna-training.html
   (upload it to Darbna as an "interactive HTML" material, or open it directly).

Usage:  python3 training/build.py
Needs:  pip install openpyxl
"""
import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "source"
DATA = ROOT / "data"
DIST = ROOT / "dist"
TEMPLATE = ROOT / "src" / "app.html"

# Header text -> field name. Anything not listed is ignored.
HEADER_ROLES = {
    "English": "en",
    "التعبير": "en",
    "الاختصار ومعناه": "en",
    "التركيب": "en",
    "العبارة": "en",
    "الكلمة أو التعبير": "en",
    "Word or expression": "en",
    "الجملة بالإنجليزي": "en",
    "الإنجليزي": "en",
    "الصيغة الأساسية (صحيحة)": "en",
    "السؤال بالإنجليزي": "en",
    "السؤال / الموضوع": "en",
    "Question / السؤال": "en_ar",
    "النص الإنجليزي": "en",
    "المعنى بالعربي": "ar",
    "المعنى": "ar",
    "العربي": "ar",
    "معناه": "ar",
    "السؤال بالعربي": "ar",
    "المعنى المقصود أو الصحيح": "ar",
    "المعنى الصحيح": "ar",
    "ملاحظات": "note",
    "الشرح والاستخدام": "note",
    "الشرح والاستخدام / الجزء": "note",
    "الاستخدام": "note",
    "الشرح": "note",
    "التوضيح": "note",
    "الفرق والاستخدام": "note",
    "سبب تقليل التركيز / المصدر": "note",
    "سبب تقليل الأولوية / المصدر": "note",
    "شرح / تفاصيل تحتاج مراجعة": "note",
    "ما ينقص / الشرح": "note",
    "مثال وترجمته": "example",
    "مثال / صياغة أبسط": "example",
    "مثال": "example",
    "Example / مثال": "example",
    "Example in English": "example",
    "معنى المثال بالعربي": "exampleAr",
    "البديل الوارد بالمصدر": "alt",
    "الجملة في الصورة": "wrong",
    "الجملة في الملف": "wrong",
    "الصياغة السابقة": "wrong",
    "البديل المقترح أو الصيغة الصحيحة": "correct",
    "بديل أو مثال وترجمته": "correct",
    "الصياغة الصحيحة": "correct",
    "الإجابة النموذجية": "answer",
    "قالب توضيحي قابل للتخصيص": "answer",
    "الإجابة بالإنجليزي": "answer",
    "English answer / الإجابة بالإنجليزي": "answer",
    "النص اللي جهزناه": "answer",
    "ترجمة الإجابة": "answerAr",
    "الترجمة": "answerAr",
    "Arabic meaning / المعنى بالعربي": "answerAr",
    "الفصل": "group",
    "الموضوع": "group",
    "الدور أو الموقف": "role",
    "الجزء": "part",
    "Version / النسخة": "version",
    "الكلمات المطلوبة": "words",
    "المطلوب": "task",
}

# Per-sheet overrides when a header means something else in that sheet.
SHEET_OVERRIDES = {
    "طلباتي بالإنجليزي": {"الاستخدام": "group"},
    "كورس - فيديو تاسك": {"النص اللي جهزناه": "en"},
}

# Tables that are only source links, not study content.
SKIP_TABLE_FIRST_HEADERS = {"المصدر", "مراجع تدقيق المعنى", "مراجع تدقيق إضافية", "روابط التكليفات"}

# Sheets that only track course status (not study material).
SKIP_SHEETS = {"كورس - ابدأ هنا", "كورس - النواقص"}

# How sheets are grouped into topics inside the English subject.
ENGLISH_TOPICS = [
    ("grammar", "القواعد والتركيبات", "🧩", "تركيبات الجمل وحروف الجر واختيار الكلمة الصح",
     ["التركيبات اللغوية", "استخدامات over", "قل ولا تقل - فروق الاستخدام"]),
    ("expressions", "تعبيرات ومصطلحات", "💬", "تعبيرات يومية ومصطلحات وطرق التعبير عن المشاعر",
     ["جمل مختلفة", "مصطلحات", "تعبيرات يومية 1", "تعبيرات يومية 2-4", "مواقف ومفردات",
      "عنّي - محادثات يومية", "اختصارات الشات", "عبارات تشجيعية"]),
    ("work", "الشغل والمقابلات", "💼", "النقاش في الشغل، أسئلة المقابلات وإجاباتك",
     ["الشغل والنقاش", "مقابلات العمل", "موضوعات تحتاج تخصيص", "عنّي - أسئلة وإجابات",
      "عنّي - كلمات وتعبيرات", "طلباتي بالإنجليزي"]),
    ("course", "الكورس", "🎓", "فصول الكورس: الكلمات المهمة، الأسئلة، البرزنتيشنز والحوارات",
     ["كورس - الكلمات المهمة", "كورس - أسئلة الفصول", "كورس - البرزنتيشنز",
      "كورس - فيديو تاسك", "كورس - حوار وجمل"]),
    ("mistakes", "الأخطاء والتصحيحات", "🛠️", "أخطاء شائعة وصيغ أقل أولوية مع البديل الصحيح",
     ["كورس - التصحيحات", "جمل أقل أولوية"]),
]

HEADING_RE = re.compile(
    r"^(Part \d+|\d+\.\s|الحوار$|مصطلحات إضافية|إضافات |مراجعات |التعبيرات المختارة|الجملة الأصلية)"
)


def clean(v):
    if v is None:
        return ""
    s = str(v).replace("\r", "").strip()
    return re.sub(r"[ \t]+", " ", s)


def split_en_ar(text):
    """'English line\\nArabic line' -> (en, ar)."""
    parts = [p.strip() for p in text.split("\n") if p.strip()]
    if not parts:
        return "", ""
    en_lines, ar_lines = [], []
    for p in parts:
        (ar_lines if re.search(r"[؀-ۿ]", p) and not re.match(r"^[A-Za-z]", p) else en_lines).append(p)
    return " ".join(en_lines), " ".join(ar_lines)


def make_item(fields, sheet):
    item = {}
    for k, v in fields.items():
        if v:
            item[k] = v
    if "en_ar" in item:
        en, ar = split_en_ar(item.pop("en_ar"))
        item["en"] = en
        if ar:
            item["ar"] = ar
    for key, ar_key in (("example", "exampleAr"), ("correct", "correctAr")):
        if key in item and "\n" in item[key]:
            en, ar = split_en_ar(item[key])
            item[key] = en
            if ar and ar_key not in item:
                item[ar_key] = ar
    # Item type decides which questions can be generated.
    if "wrong" in item:
        item["type"] = "correction"
    elif "answer" in item and "en" in item:
        item["type"] = "qa"
    elif "role" in item:
        item["type"] = "dialogue"
    elif "part" in item or "words" in item:
        item["type"] = "passage"
    elif "en" in item and "ar" in item:
        item["type"] = "phrase"
    else:
        return None
    if item["type"] == "passage" and item.get("part") == "المطلوب":
        item["type"] = "task"
    return item


def parse_sheet(ws):
    name = ws.title
    roles = dict(HEADER_ROLES)
    roles.update(SHEET_OVERRIDES.get(name, {}))
    sheet = {"title": name, "intro": [], "sections": []}
    section = None
    cols = None
    skipping_table = False
    rows = [[clean(c) for c in r] for r in ws.iter_rows(values_only=True)]

    def new_section(title):
        nonlocal section
        section = {"title": title, "notes": [], "items": []}
        sheet["sections"].append(section)
        return section

    for idx, row in enumerate(rows):
        filled = [c for c in row if c]
        if not filled:
            continue
        # Header row?
        if (len(filled) >= 2 and sum(c in roles for c in filled) >= 2) or row[0] in SKIP_TABLE_FIRST_HEADERS:
            if row[0] in SKIP_TABLE_FIRST_HEADERS:
                skipping_table = True
                continue
            skipping_table = False
            cols = [roles.get(c) for c in row]
            if section is None:
                new_section(name)
            continue
        if len(filled) == 1 and row[0]:
            text = row[0]
            if idx <= 1 and not sheet["intro"] and not HEADING_RE.match(text) and len(sheet["sections"]) == 0 and len(text) < 70:
                sheet["heading"] = text
                continue
            if HEADING_RE.match(text) and len(text) < 90:
                skipping_table = False
                cols = None
                new_section(text)
                continue
            if text.startswith("المصدر:") or text.startswith("آخر تجميع"):
                continue
            (section["notes"] if section else sheet["intro"]).append(text)
            continue
        if skipping_table or cols is None:
            continue
        fields = {}
        for role, val in zip(cols, row):
            if role and val:
                fields[role] = val
        item = make_item(fields, name)
        if item:
            if section is None:
                new_section(name)
            section["items"].append(item)

    # Sheets with a group column: split by group (chapter / usage).
    regrouped = []
    for sec in sheet["sections"]:
        if any("group" in it for it in sec["items"]):
            order, by = [], {}
            for it in sec["items"]:
                g = it.pop("group", "") or sec["title"]
                if g not in by:
                    by[g] = {"title": g, "notes": [], "items": []}
                    order.append(g)
                by[g]["items"].append(it)
            if sec["notes"]:
                by[order[0]]["notes"] = sec["notes"] + by[order[0]]["notes"]
            regrouped.extend(by[g] for g in order)
        else:
            regrouped.append(sec)
    sheet["sections"] = [s for s in regrouped if s["items"] or s["notes"]]
    return sheet


def slug(i, j=None):
    return f"s{i}" if j is None else f"s{i}-{j}"


def build_english():
    wb = openpyxl.load_workbook(SRC / "english.xlsx", data_only=True)
    sheets = {ws.title: parse_sheet(ws) for ws in wb if ws.title not in SKIP_SHEETS}
    used = set()
    topics = []
    item_no = 0
    for tid, title, _icon, desc, names in ENGLISH_TOPICS:
        lessons = []
        for n in names:
            if n not in sheets:
                continue
            used.add(n)
            sh = sheets[n]
            sections = []
            for k, sec in enumerate(sh["sections"]):
                for it in sec["items"]:
                    item_no += 1
                    it["id"] = f"en{item_no}"
                sections.append({"id": f"{tid}-{len(lessons)}-{k}", **sec})
            lessons.append({
                "id": f"{tid}-{len(lessons)}",
                "title": n.replace("كورس - ", "").replace("عنّي - ", "عنّي: "),
                "heading": sh.get("heading", ""),
                "intro": sh["intro"],
                "sections": sections,
            })
        topics.append({"id": tid, "title": title, "desc": desc, "lessons": lessons})
    leftover = [n for n in sheets if n not in used]
    if leftover:
        print("WARNING: sheets not placed in any topic:", leftover, file=sys.stderr)
    return {
        "id": "english",
        "title": "الإنجليزي",
        "mono": "En",
        "lang": "en",
        "desc": "تعبيرات، قواعد، مقابلات شغل، والكورس — شرح وتدريب واختبارات",
        "topics": topics,
    }


def merge_extra(subject):
    extra_path = DATA / f"{subject['id']}.extra.json"
    if not extra_path.exists():
        return subject
    extra = json.loads(extra_path.read_text(encoding="utf-8"))
    sections = {s["id"]: s for t in subject["topics"] for l in t["lessons"] for s in l["sections"]}
    by_title = {s["title"]: s for s in sections.values()}
    for key, add in extra.get("sections", {}).items():
        sec = sections.get(key) or by_title.get(key)
        if not sec:
            print(f"WARNING: extra section '{key}' not found", file=sys.stderr)
            continue
        sec.setdefault("rules", []).extend(add.get("rules", []))
        sec.setdefault("questions", []).extend(add.get("questions", []))
        if add.get("focus"):
            sec["focus"] = add["focus"]
    return subject


def load_subjects():
    subjects = [merge_extra(build_english())]
    (DATA / "english.json").write_text(json.dumps(subjects[0], ensure_ascii=False, indent=1), encoding="utf-8")
    # Any other ready-made subject JSON (e.g. frontend.json, marketing.json) is included as-is.
    for p in sorted(DATA.glob("*.json")):
        if p.name in ("english.json",) or p.name.endswith(".extra.json"):
            continue
        subjects.append(merge_extra(json.loads(p.read_text(encoding="utf-8"))))
    return subjects


def main():
    DATA.mkdir(exist_ok=True)
    DIST.mkdir(exist_ok=True)
    subjects = load_subjects()
    payload = json.dumps(subjects, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html = TEMPLATE.read_text(encoding="utf-8").replace("/*__DATA__*/[]", payload)
    out = DIST / "darbna-training.html"
    out.write_text(html, encoding="utf-8")
    for s in subjects:
        n_items = sum(len(sec["items"]) for t in s["topics"] for l in t["lessons"] for sec in l["sections"])
        n_secs = sum(len(l["sections"]) for t in s["topics"] for l in t["lessons"])
        print(f"{s['title']}: {len(s['topics'])} topics, {n_secs} sections, {n_items} items")
    print(f"Wrote {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
