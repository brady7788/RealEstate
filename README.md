# LandLens Indiana

Statewide off-market land search and development underwriting for Indiana. LandLens is a single self-contained web page (`index.html`): open it in a browser and it queries live public parcel data as you search. There is nothing to install or build.

## Features

- **Statewide parcel search** across all 92 counties, querying IndianaMap's *Parcel Boundaries of Indiana 2025* layer live.
- **Filters:** county, DLGF property class (vacant land, agricultural, industrial, commercial, residential, exempt), minimum and maximum acreage, address / parcel ID / city / zip text search, and limit to the visible map area. HOA / subdivision common areas are hidden by default.
- **Assessed value and ownership in all 92 counties**, from each county's 2025 pay 2026 Real Property file on Indiana Gateway, with a Min / Max Assessed Value filter. Marion County is also pulled live from the City of Indianapolis / Marion County's *Parcels w/ Owner Information & Assessed Values* service, which is tried first.
- **Interactive map** with dark and satellite basemaps; click anywhere to identify a parcel.
- **Parcel detail panel:**
  - **Parcel Record:** parcel IDs, acreage calculated from the boundary, property class, address, township, school and tax districts, plus assessed value, owner, mailing address, transfer date, assessor class, deeded acreage and ownership indicators.
  - **Development Engine:** choose **Apartment Development** or **Neighborhood Development**. LandLens finds comparable projects near the parcel and shows the density they were built at, a comp-based unit range for the site, and an editable residual land value model:
    - *Apartments:* parcels within 3 miles (widening to 6, then 10) in DLGF apartment classes 401–403, from half to twice the site's acreage. Units are counted from IndianaMap's statewide address points where a county maps one per unit, otherwise estimated from building footprints at a footprint-per-unit ratio calibrated on the nearby comps.
    - *Neighborhoods:* tracts within 3 miles (widening to 5) that were a single parcel of similar acreage in IndianaMap's 2013 parcel layer and now hold at least 8 house lots. Density is homes plus platted lots per gross tract acre.
    - Closer comps count more: each is weighted 1 / (miles + 0.5), so a comp 1 mile away counts 2.3× one 3 miles away. The range (25th–75th percentile) and median are weighted, and each comp shows its share of the weight.
    - A range is shown only with at least 3 comps. Comps are outlined on the map; click one to zoom to it.
  - **Analyst Chat:** a built-in assistant that answers from the parcel's record and your model inputs. It doesn't call any AI service and needs no API key.
- **Watchlist** saved in your browser.

## Running it

Open `index.html` in Chrome, Safari, Edge or Firefox. It needs an internet connection for parcel data and map tiles. Some file previewers block outside requests; if parcels don't load, open it in a regular browser tab.

Assessed values are read from `data/assessments/`. Served from GitHub Pages or a local server, the page loads them from there; opened directly as a file, it loads the same files from this repository on GitHub.

To serve it locally instead:

```bash
python3 -m http.server 5173
```

then open http://localhost:5173.

### Map tiles

The map uses Esri's free dark gray basemap with its street and place-name layer, and Satellite uses Esri imagery with road and place-name labels. Neither needs a key. If those tiles don't load (some networks, browsers and extensions block a tile host), Map falls back to OpenStreetMap and Satellite to USGS imagery with labels. Indiana's county outlines come from IndianaMap, the same server as the parcels, so the state shows even when no tile host is reachable.

CARTO's basemaps, which LandLens used before, now need a free API key: without one, CARTO serves tiles stamped "API KEY REQUIRED". To use CARTO or Mapbox instead, set `CARTO_KEY` or `MAPBOX_TOKEN` near the top of the main script in `index.html`. These keys are visible to anyone who loads the page, so restrict them to your site's URLs before publishing.

## Data sources

| Data | Source | Notes |
| --- | --- | --- |
| Parcel boundaries, IDs, addresses, property class, tax districts | [IndianaMap / IGIO, Parcel Boundaries of Indiana 2025](https://gisdata.in.gov/server/rest/services/Hosted/Parcel_Boundaries_of_Indiana_2025/FeatureServer/0) | Statewide, updated annually |
| Assessed values, owner, mailing address, transfer date, deeded acreage (all counties) | [Indiana Gateway for Government Units, Property Files: Real Property](https://gateway.ifionline.org/public/download.aspx) | Files counties submit to the DLGF, 2025 pay 2026; layout per 50 IAC 26. Built into `data/assessments/` |
| Development comps: 2013 parcels, address points, building footprints | [IndianaMap / IGIO: Parcel Boundaries of Indiana 2013](https://gisdata.in.gov/server/rest/services/Hosted/Parcels_Boundaries_of_Indiana_2013/FeatureServer/7), [Address Points of Indiana Current](https://gisdata.in.gov/server/rest/services/Hosted/Address_Points_of_Indiana_Current/FeatureServer/0), [Indiana Building Footprints 2016–2020](https://gisdata.in.gov/server/rest/services/Hosted/Building_Footprints/FeatureServer/0) | Queried live; footprints come from 2016–2020 lidar, so newer buildings are missing |
| Marion County assessed values, owner, mailing address | [City of Indianapolis / Marion County, Parcels w/ Owner Information & Assessed Values](https://data.indy.gov/datasets/IndyGIS::parcels-w-owner-information-assessed-values) | Updated nightly from IndyGIS and the Marion County Assessor |

Data derived from the City of Indianapolis / Marion County service is provided by the City of Indianapolis / Marion County, IN, as its license requires.

Acreage is calculated from each parcel's mapped boundary. Assessed values for agricultural, wooded and other farm-use land are set by Indiana's farmland formula (2025 base rate $2,120/acre) and are not market values; the app flags these parcels.

About 5% of parcels are reported at $0, mostly exempt property (class 6xx), HOA / subdivision common areas and state-assessed utility property (class 8xx). The app labels these instead of showing a bare $0, and leaves them out of Min / Max Assessed Value searches.

Parcels are matched to assessor records by their 18-digit state parcel number. In a sample of 24,000 parcels across 12 counties, 99.7% matched; the rest were mostly split, combined or renumbered since the assessment. Parcels with no state parcel number in the IndianaMap layer can't be matched.

### Updating the assessment data

1. On [Indiana Gateway's download page](https://gateway.ifionline.org/public/download.aspx), under *Property Files*, choose *Real Property*, the year, and a county, then *Download*. Repeat for each county; the builder expects one county per zip.
2. Put the zips in one folder and run:

```bash
python3 tools/build_assessments.py path/to/zips data/assessments
```

This rewrites `data/assessments/index.json` and each county's shard files (`NN/sK.json.gz`, records sorted by state parcel number).

## Not yet included

- Sale history, zoning, floodplain and a comparable-projects database

## Third-party libraries

Bundled inside `index.html`: Tailwind CSS (compiled), Leaflet 1.9.4 (BSD-2-Clause), Lucide icons (ISC).
