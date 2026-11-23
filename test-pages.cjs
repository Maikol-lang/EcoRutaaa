const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Test desktop
  const desktopPage = await context.newPage();
  desktopPage.setViewportSize({ width: 1280, height: 800 });

  // Test mobile
  const mobilePage = await context.newPage();
  mobilePage.setViewportSize({ width: 375, height: 812 });

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Stats', path: '/stats' }
  ];

  for (const page of pages) {
    console.log(`\n=== Testing ${page.name} (${page.path}) ===`);

    for (const [label, testPage] of [['Desktop', desktopPage], ['Mobile', mobilePage]]) {
      const errors = [];
      testPage.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      testPage.on('pageerror', err => errors.push(err.message));

      try {
        await testPage.goto(`http://127.0.0.1:5173${page.path}`, { waitUntil: 'networkidle', timeout: 15000 });
        await testPage.waitForTimeout(1000);

        // Check for horizontal scroll
        const hasHorizontalScroll = await testPage.evaluate(() => document.body.scrollWidth > window.innerWidth);

        console.log(`${label}: ${errors.length === 0 ? '✓' : '✗'} Console errors: ${errors.length} | Horizontal scroll: ${hasHorizontalScroll ? 'YES (BAD)' : 'NO'}`);
        if (errors.length > 0) {
          errors.forEach(e => console.log(`  - ${e.substring(0, 100)}`));
        }

        // Check dark mode
        await testPage.evaluate(() => document.documentElement.classList.add('dark'));
        await testPage.waitForTimeout(300);
        const darkErrors = [];
        testPage.on('console', msg => { if (msg.type() === 'error') darkErrors.push(msg.text()); });
        await testPage.waitForTimeout(500);
        console.log(`${label} Dark: ${darkErrors.length === 0 ? '✓' : '✗'} Console errors: ${darkErrors.length}`);

        // Reset to light
        await testPage.evaluate(() => document.documentElement.classList.remove('dark'));
      } catch (e) {
        console.log(`${label}: ✗ Navigation failed - ${e.message}`);
      }
    }
  }

  await browser.close();
}

test().catch(console.error);