import { test, expect } from '@playwright/test';

const routes = ['/', '/app', '/map', '/waste-guide', '/clean-points', '/stats', '/rewards', '/login', '/register'];

for (const route of routes) {
  test(`Carga ${route} sin errores de consola`, async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));
    
    await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    const relevantErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('Source map') &&
      !e.includes('DevTools')
    );
    
    if (relevantErrors.length > 0) {
      console.log(`❌ ${route}:`, relevantErrors);
    } else {
      console.log(`✅ ${route}: OK`);
    }
    
    expect(relevantErrors).toHaveLength(0);
  });
}
