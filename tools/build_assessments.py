#!/usr/bin/env python3
"""Build per-county assessed value lookups from Indiana Gateway Real Property (PARCEL) files.

Download each county's Real Property file from https://gateway.ifionline.org/public/download.aspx
(Property Files > Real Property > year), then:

    python3 tools/build_assessments.py PATH/TO/ZIPS data/assessments

Each zip holds one fixed-width PARCEL file laid out per 50 IAC 26 (Rule 20). Output, per county
(keyed by the 2-digit DLGF county number):

    data/assessments/index.json            counties, field list, shard ranges
    data/assessments/NN/sK.json.gz         records sorted by 18-digit state parcel number

Shards are contiguous key ranges so neighbouring parcels (which share a state parcel number prefix)
land in the same file; the page binary-searches the shards' first keys in index.json. Parcels are
matched on the state parcel number only: local parcel numbers added no matches against the IndianaMap
parcel layer.
"""
import gzip, json, os, re, sys, zipfile

SHARD_SIZE = 2500

# (name, start, end) 1-based inclusive positions from 50 IAC 26, PARCEL file
LAYOUT = {
    "parcel": (1, 25), "cls": (194, 196), "owner": (224, 303), "ownerStreet": (304, 363), "ownerCity": (364, 393),
    "ownerState": (394, 423), "ownerZip": (424, 433), "ownerCountry": (434, 436), "transferDate": (437, 446),
    "landAV": (469, 480), "impAV": (481, 492), "totalAV": (493, 504), "acres": (697, 708),
    "anonymous": (1250, 1250),
}
# Field order of each record array in the shard files (index.json repeats it for the page)
FIELDS = ["owner", "ownerStreet", "ownerCity", "ownerState", "ownerZip", "ownerCountry", "cls",
          "landAV", "impAV", "totalAV", "acres", "transferDate"]


def col(line, name):
    a, b = LAYOUT[name]
    return line[a - 1:b].strip()


def whole(s):
    s = s.strip()
    return int(s) if s.lstrip("-").isdigit() else None


def acres(s):
    # Format 8.4 with implied decimal: 000200001000 -> 20.1
    n = whole(s)
    return round(n / 10000, 4) if n is not None else None


def tidy(s):
    return re.sub(r"\s+", " ", s).strip()


def parse(text):
    """Yield (state_number, record) for each parcel row of a PARCEL file."""
    for line in text.splitlines():
        if line.startswith("PARCEL ") or len(line) < 504:
            continue  # header row or truncated line
        state = re.sub(r"\D", "", col(line, "parcel"))
        if len(state) != 18:
            continue
        anon = col(line, "anonymous").upper() == "Y"
        country = col(line, "ownerCountry").upper()
        ownerZip = col(line, "ownerZip")
        if ownerZip.endswith("-0000"):
            ownerZip = ownerZip[:5]
        rec = {
            "owner": None if anon else tidy(col(line, "owner")) or None,
            "ownerStreet": None if anon else tidy(col(line, "ownerStreet")) or None,
            "ownerCity": None if anon else tidy(col(line, "ownerCity")) or None,
            "ownerState": None if anon else col(line, "ownerState").upper() or None,
            "ownerZip": None if anon else ownerZip or None,
            "ownerCountry": None if anon or country in ("", "USA", "US") else country,
            "cls": col(line, "cls") or None,
            "landAV": whole(col(line, "landAV")),
            "impAV": whole(col(line, "impAV")),
            "totalAV": whole(col(line, "totalAV")),
            "acres": acres(col(line, "acres")),
            "transferDate": col(line, "transferDate") or None,
        }
        yield state, [rec[f] for f in FIELDS]


def header_info(text):
    first = text.split("\n", 1)[0]
    m = re.match(r"PARCEL\s+(\d\d)(.{20})", first)
    year = re.search(r"\d\d/\d\d/\d{4}\d{4}(\d{4})(\d{4})", first)
    return {
        "created": re.search(r"(\d\d/\d\d/\d{4})", first).group(1) if re.search(r"(\d\d/\d\d/\d{4})", first) else None,
        "assessmentYear": int(year.group(1)) if year else None,
        "payYear": int(year.group(2)) if year else None,
    }


def write_json(path, obj):
    data = json.dumps(obj, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    if path.endswith(".gz"):
        # mtime=0 keeps rebuilds byte-identical when the data hasn't changed
        with open(path, "wb") as f, gzip.GzipFile(fileobj=f, mode="wb", compresslevel=9, mtime=0) as g:
            g.write(data)
    else:
        with open(path, "wb") as f:
            f.write(data)


def shard(items, outdir, prefix):
    """items: sorted list of (key, value). Writes outdir/prefixK.json.gz, returns first key of each shard."""
    starts = []
    for k, i in enumerate(range(0, len(items), SHARD_SIZE)):
        chunk = items[i:i + SHARD_SIZE]
        starts.append(chunk[0][0])
        write_json(os.path.join(outdir, f"{prefix}{k}.json.gz"), dict(chunk))
    return starts


def build_county(zpath, outroot):
    with zipfile.ZipFile(zpath) as z:
        names = [n for n in z.namelist() if n.lower().endswith(".txt")]
        if len(names) != 1:
            raise ValueError(f"{zpath}: expected one .txt, found {names}")
        text = z.read(names[0]).decode("latin-1")
    m = re.search(r"RealParcel_(.+)_(\d\d)_", os.path.basename(names[0]), re.I)
    name, num = m.group(1).replace("_", " "), m.group(2)
    recs, dupes = {}, 0
    for state, rec in parse(text):
        if state in recs:
            dupes += 1
        recs[state] = rec
    outdir = os.path.join(outroot, num)
    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir):
        if re.fullmatch(r"s\d+\.json\.gz", f):
            os.remove(os.path.join(outdir, f))
    info = header_info(text)
    entry = {
        "num": num, "name": name, "fips": f"18{int(num) * 2 - 1:03d}", "records": len(recs),
        "duplicates": dupes, **info,
        "shards": shard(sorted(recs.items()), outdir, "s"),
    }
    return entry


def main():
    src, outroot = sys.argv[1], sys.argv[2]
    os.makedirs(outroot, exist_ok=True)
    counties = []
    for fn in sorted(os.listdir(src)):
        if fn.lower().endswith(".zip"):
            e = build_county(os.path.join(src, fn), outroot)
            print(f"{e['num']} {e['name']:<12} {e['records']:>8} parcels  {len(e['shards'])} shards  "
                  f"dupes={e['duplicates']}", flush=True)
            counties.append(e)
    write_json(os.path.join(outroot, "index.json"), {
        "source": "Indiana Gateway for Government Units, Real Property (PARCEL) files, https://gateway.ifionline.org/public/download.aspx",
        "fields": FIELDS,
        "counties": {e["fips"]: e for e in counties},
    })


if __name__ == "__main__":
    main()
