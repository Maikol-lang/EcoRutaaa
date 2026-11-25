import { test, expect } from '@playwright/test';

test('Desktop test', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await expect(page.locator('text=Gestión Inteligente')).toBeVisible();
  console.log('Landing page loaded');
  
  await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle' });
  await expect(page.locator('text=Panel Ciudadano')).toBeVisible();
  console.log('MyRoute page loaded');
  
  if (errors.length > 0) {
    console.log('CONSOLE ERRORS:', errors);
    throw new Error('Console errors found');
  }
  console.log('No console errors');
});

test('Mobile test', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await expect(page.locator('text=Gestión Inteligente')).toBeVisible();
  console.log('Landing page loaded mobile');
  
  await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle' });
  await expect(page.locator('text=Panel Ciudadano')).toBeVisible();
  console.log('MyRoute page loaded mobile');
  
  if (errors.length > 0) {
    console.log('CONSOLE ERRORS:', errors);
    throw new Error('Console errors found');
  }
  console.log('No console errors mobile');
});
