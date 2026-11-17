"""Build LandLens's built-in place list from the GeoNames-based cities.json package (CC-BY-4.0).
Indiana: every place in the file, tagged with its county FIPS (3 digits). Nearby states: a short list of
major cities, tagged with the state code. Output: one JS string, entries 'name|lat|lng|tag' joined by ';'."""
import json, sys
src = json.load(open(sys.argv[1]))
OTHER = {'IL': ['Chicago', 'Springfield', 'Champaign', 'Peoria', 'Naperville', 'Joliet', 'Danville'],
         'OH': ['Columbus', 'Cincinnati', 'Dayton', 'Toledo', 'Cleveland', 'Akron'],
         'KY': ['Louisville', 'Lexington', 'Owensboro', 'Bowling Green'],
         'MI': ['Detroit', 'Grand Rapids', 'Kalamazoo', 'Lansing', 'Ann Arbor'],
         'MO': ['St. Louis'], 'TN': ['Nashville', 'Memphis'], 'WI': ['Milwaukee', 'Madison']}
out = []
for c in src:
    if c.get('country') != 'US':
        continue
    st = c.get('admin1')
    if st == 'IN':
        out.append(f"{c['name']}|{float(c['lat']):.4f}|{float(c['lng']):.4f}|{c.get('admin2') or ''}")
    elif st in OTHER and c['name'] in OTHER[st]:
        out.append(f"{c['name']}|{float(c['lat']):.4f}|{float(c['lng']):.4f}|{st}")
out.sort()
print(f"        // GeoNames populated places (cities.json package, CC-BY-4.0): every Indiana place (tag = county FIPS) and major nearby cities (tag = state)")
print(f"        const PLACE_DATA = '{';'.join(out).replace(chr(39), chr(92) + chr(39))}';")
print(len(out), file=sys.stderr)
