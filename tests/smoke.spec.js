// @ts-check
const { test, expect } = require('@playwright/test');

const TABS = ['hoy', 'historial', 'informes', 'finanzas', 'hogar', 'nutricion', 'actividad', 'salud', 'tools'];

test.describe('NutrIA smoke', () => {

  test.beforeEach(async ({ page }) => {
    // Capture console errors so we can dump them on failure
    page.on('pageerror', err => console.error('PAGEERROR:', err.message));
  });

  test('app boots without runtime errors', async ({ page }) => {
    await page.goto('/index.html');
    // Wait until IIFE has completed (window.NutrIA only set at end of IIFE)
    await page.waitForFunction(() => typeof window.NutrIA !== 'undefined', { timeout: 10000 });
    // Initial render must produce content (the bug we want to catch)
    const main = await page.locator('#main-content').innerHTML();
    expect(main.trim().length, 'main-content empty after boot').toBeGreaterThan(50);
    const errors = await page.evaluate(() => window.__nutriaErrors || []);
    expect(errors, `runtime errors at boot: ${JSON.stringify(errors.slice(0, 3))}`).toHaveLength(0);
  });

  test('all tabs render without errors', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(() => typeof window.NutrIA !== 'undefined');
    // Wait a beat for async data fetches to settle
    await page.waitForTimeout(500);

    for (const tab of TABS) {
      await page.click(`.pill[data-period="${tab}"]`);
      await page.waitForTimeout(250);
      const html = await page.locator('#main-content').innerHTML();
      expect(html.length, `tab '${tab}' produced empty content`).toBeGreaterThan(80);
      const errors = await page.evaluate(() => window.__nutriaErrors || []);
      expect(errors.length, `tab '${tab}' triggered errors: ${JSON.stringify(errors.slice(0, 3))}`).toBe(0);
    }
  });

  test('window.NutrIA bridge has all required functions', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(() => typeof window.NutrIA !== 'undefined');
    const required = ['getDay', 'getDayTotals', 'getTDEE', 'render', 'getTodayStr', 'TARGETS'];
    const missing = await page.evaluate((req) =>
      req.filter(name => typeof window.NutrIA[name] === 'undefined'), required);
    expect(missing, `missing NutrIA bridge methods: ${missing.join(', ')}`).toHaveLength(0);
  });

  test('keyboard navigation works (← H →)', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(() => typeof window.NutrIA !== 'undefined');
    await page.waitForTimeout(300);
    const today = await page.evaluate(() => window.NutrIA.getTodayStr());
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);
    const yesterday = await page.evaluate(() => window.NutrIA.currentDate);
    expect(yesterday).not.toBe(today);
    await page.keyboard.press('h');
    await page.waitForTimeout(150);
    const back = await page.evaluate(() => window.NutrIA.currentDate);
    expect(back).toBe(today);
  });
});
