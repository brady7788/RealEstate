// Scores how the analyst routes held-out questions to topics.
// Usage: from the repo root, start a local server (python3 -m http.server 8765), then
//   npm install playwright && node tools/analyst-eval/run.js [set-a|set-b]
// It loads index.html, opens a sample parcel and checks each question's topics (no answers are generated).
const { chromium } = require('playwright');
const tests = require(`./${process.argv[2] || 'set-a'}.js`);
const lat = 40.835, lng = -84.93, d = 0.0012;
const feat = { attributes: { objectid: 77, parcel_id: '01-01-01-100-002.500-012', state_parcel_id: '010101100002500012', prop_add: '11555 N US HIGHWAY 27',
  prop_city: 'DECATUR', dlgf_prop_class_code: '100', county_fips: '18001', county_id: '01', latitude: lat, longitude: lng },
  geometry: { rings: [[[lng - d, lat - d], [lng - d, lat + d], [lng + d, lat + d], [lng + d, lat - d], [lng - d, lat - d]]] } };
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const p = await b.newPage();
  await p.route(/^https?:/, r => {
    const u = r.request().url();
    if (u.startsWith('http://localhost:8765')) return r.continue();
    if (u.includes('Parcel_Boundaries_of_Indiana_2025')) {
      const q = Object.fromEntries(new URLSearchParams(r.request().postData() || ''));
      return r.fulfill({ contentType: 'application/json', body: JSON.stringify(q.returnCountOnly ? { count: 1 } : { features: [feat] }) });
    }
    return r.abort();
  });
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1200);
  await p.selectOption('#filter-county', '18001').catch(() => {}); await p.waitForTimeout(1000);
  await p.click('#parcel-list > div:nth-child(1)'); await p.waitForTimeout(500);
  const res = await p.evaluate(tests => tests.map(([q, want]) => ({ q, want, got: analystTopics(q, selectedParcel) })), tests);
  const ok = res.filter(r => r.got.includes(r.want));
  console.log(`${ok.length}/${res.length} routed correctly (${(ok.length / res.length * 100).toFixed(1)}%)`);
  res.filter(r => !r.got.includes(r.want)).forEach(r => console.log(`  MISS want=${r.want} got=[${r.got}] | ${r.q}`));
  await b.close();
})();
