import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:4173';

test('Desktop test - Light mode', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await expect(page.locator('text=Gestión Inteligente')).toBeVisible();
  console.log('Landing page loaded');

  // Check community section exists
  await expect(page.locator('text=Lo que dice la comunidad')).toBeVisible();
  await expect(page.locator('text=Compartir mi experiencia')).toBeVisible();

  await page.goto(`${baseURL}/app`, { waitUntil: 'networkidle' });
  await expect(page.locator('text=Panel Ciudadano')).toBeVisible();
  console.log('MyRoute page loaded');

  if (errors.length > 0) {
    console.log('CONSOLE ERRORS:', errors);
    throw new Error('Console errors found');
  }
  console.log('No console errors');
});

test('Desktop test - Dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: 'dark' });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await expect(page.locator('text=Gestión Inteligente')).toBeVisible();
  console.log('Landing page loaded dark mode');

  // Check community section exists
  await expect(page.locator('text=Lo que dice la comunidad')).toBeVisible();
  await expect(page.locator('text=Compartir mi experiencia')).toBeVisible();

  if (errors.length > 0) {
    console.log('CONSOLE ERRORS:', errors);
    throw new Error('Console errors found');
  }
  console.log('No console errors dark mode');
});

test('Mobile test - Light mode', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await expect(page.locator('text=Gestión Inteligente')).toBeVisible();
  console.log('Landing page loaded mobile');

  // Check community section exists
  await expect(page.locator('text=Lo que dice la comunidad')).toBeVisible();
  await expect(page.locator('text=Compartir mi experiencia')).toBeVisible();

  await page.goto(`${baseURL}/app`, { waitUntil: 'networkidle' });
  await expect(page.locator('text=Panel Ciudadano')).toBeVisible();
  console.log('MyRoute page loaded mobile');

  if (errors.length > 0) {
    console.log('CONSOLE ERRORS:', errors);
    throw new Error('Console errors found');
  }
  console.log('No console errors mobile');
});

test('Mobile test - Dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ colorScheme: 'dark' });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await expect(page.locator('text=Gestión Inteligente')).toBeVisible();
  console.log('Landing page loaded mobile dark mode');

  // Check community section exists
  await expect(page.locator('text=Lo que dice la comunidad')).toBeVisible();
  await expect(page.locator('text=Compartir mi experiencia')).toBeVisible();

  if (errors.length > 0) {
    console.log('CONSOLE ERRORS:', errors);
    throw new Error('Console errors found');
  }
  console.log('No console errors mobile dark mode');
});
