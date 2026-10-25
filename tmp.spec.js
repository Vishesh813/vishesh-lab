const { test } = require('@playwright/test');
test('sd desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001/system-design/', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const r = (sel) => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const cs = getComputedStyle(e);
      return { display: cs.display, width: Math.round(e.getBoundingClientRect().width), gridTemplateColumns: cs.gridTemplateColumns, classes: e.className };
    };
    return {
      trackHeroGrid: r('.track-hero-grid'),
      trackHeroPanel: r('.track-hero-panel'),
      designLayout: r('.design-layout'),
      designMain: r('.design-main'),
      sidebar: r('.sidebar, .design-sidebar'),
      progress: r('.dsa-dash-progress'),
    };
  });
  console.log('DESKTOP_DATA:' + JSON.stringify(data));
});
