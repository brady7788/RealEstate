"""Build LandLens's spelling-correction lists. The analyst corrects a misspelled word to one of TARGETS when it is
one or two edits away, unless the misspelling is itself a real English word (checked against the
an-array-of-english-words list, MIT). Output: JS constants SPELL_TARGETS and SPELL_REAL (the real words to leave alone)."""
import json, sys
words = set(json.load(open(sys.argv[1])))
TARGETS = """owner owners owns owned acres acreage zoning zoned sewer septic utilities utility water apartments apartment assessed assessment
value worth price prices distance nearest nearby closest school schools grocery groceries hospital hospitals wetland wetlands floodplain flood
subdivision neighborhood density comps comparables comparable taxes property parcel build built units homes houses highway interstate
restaurants restaurant shopping shops stores demographics population income financing environmental contamination residual breakeven
sensitivity margin profit return returns construction development developer revenue frontage dimensions shape adjacent neighbors neighboring
townhomes multifamily family amenities commute drive minutes miles downtown airport university college parks traffic access crime market
rents vacancy absorption soils timeline approval permits rezoning entitlement structures buildings demolish vacant farmland agricultural
township district location address county limits annexation jurisdiction offer afford budget costs from much many near what where which
there should would could about around""".split()
def edits1(w):
    letters = 'abcdefghijklmnopqrstuvwxyz'
    splits = [(w[:i], w[i:]) for i in range(len(w) + 1)]
    return {a + b[1:] for a, b in splits if b} | {a + b[1] + b[0] + b[2:] for a, b in splits if len(b) > 1} \
        | {a + c + b[1:] for a, b in splits if b for c in letters} | {a + c + b for a, b in splits for c in letters}
real = set()
for t in TARGETS:
    near = edits1(t)
    if len(t) >= 7:
        near |= {e2 for e1 in near for e2 in edits1(e1)}
    real |= {w for w in near if w in words and w not in TARGETS and len(w) >= 4}
print('        // Spelling: key words the analyst corrects toward, and real English words near them that it leaves alone')
print('        // (built by tools/build_spelling.py from the an-array-of-english-words list, MIT)')
print(f"        const SPELL_TARGETS = '{' '.join(TARGETS)}'.split(' ');")
print(f"        const SPELL_REAL = new Set('{' '.join(sorted(real))}'.split(' '));")
print(len(TARGETS), len(real), file=sys.stderr)
