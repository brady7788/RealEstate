# LandLens Indiana

Statewide off-market land search and development underwriting for Indiana. LandLens is a single self-contained web page (`index.html`): open it in a browser and it queries live public parcel data as you search. There is nothing to install or build.

## Features

- **Statewide parcel search** across all 92 counties, querying IndianaMap's *Parcel Boundaries of Indiana 2025* layer live.
- **Filters:** county, DLGF property class (vacant land, agricultural, industrial, commercial, residential, exempt), minimum and maximum acreage, address / parcel ID / city / zip text search, and limit to the visible map area. HOA / subdivision common areas are hidden by default.
- **Assessed value and ownership for Marion County**, pulled live from the City of Indianapolis / Marion County's *Parcels w/ Owner Information & Assessed Values* service, with a Min / Max Assessed Value filter. Other counties aren't connected yet.
- **Interactive map** with dark and satellite basemaps; click anywhere to identify a parcel.
- **Parcel detail panel:**
  - **Parcel Record:** parcel IDs, acreage calculated from the boundary, property class, address, township, school and tax districts, plus assessed value, owner and ownership indicators in Marion County.
  - **Development Engine:** assumption-based site yield and an editable residual land value model.
  - **Analyst Chat:** a built-in assistant that answers from the parcel's record and your model inputs. It doesn't call any AI service and needs no API key.
- **Watchlist** saved in your browser.

## Running it

Open `index.html` in Chrome, Safari, Edge or Firefox. It needs an internet connection for parcel data and map tiles. Some file previewers block outside requests; if parcels don't load, open it in a regular browser tab.

To serve it locally instead:

```bash
python3 -m http.server 5173
```

then open http://localhost:5173.

### Map tiles

By default the map uses the free CARTO dark basemap. To use Mapbox instead, set `MAPBOX_TOKEN` near the top of the main script in `index.html` to a Mapbox public token. Public tokens are visible to anyone who loads the page, so restrict the token to your site's URLs in the Mapbox dashboard before publishing it.

## Data sources

| Data | Source | Notes |
| --- | --- | --- |
| Parcel boundaries, IDs, addresses, property class, tax districts | [IndianaMap / IGIO, Parcel Boundaries of Indiana 2025](https://gisdata.in.gov/server/rest/services/Hosted/Parcel_Boundaries_of_Indiana_2025/FeatureServer/0) | Statewide, updated annually |
| Marion County assessed values, owner, mailing address | [City of Indianapolis / Marion County, Parcels w/ Owner Information & Assessed Values](https://data.indy.gov/datasets/IndyGIS::parcels-w-owner-information-assessed-values) | Updated nightly from IndyGIS and the Marion County Assessor |

Data derived from the City of Indianapolis / Marion County service is provided by the City of Indianapolis / Marion County, IN, as its license requires.

Acreage is calculated from each parcel's mapped boundary. Assessed values for agricultural, wooded and other farm-use land are set by Indiana's farmland formula (2025 base rate $2,120/acre) and are not market values; the app flags these parcels.

## Not yet included

- Assessed values and ownership outside Marion County
- Sale history, zoning, floodplain and a comparable-projects database

## Third-party libraries

Bundled inside `index.html`: Tailwind CSS (compiled), Leaflet 1.9.4 (BSD-2-Clause), Lucide icons (ISC).
