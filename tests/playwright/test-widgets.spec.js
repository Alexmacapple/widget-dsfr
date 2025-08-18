// Tests Playwright pour les widgets DSFR
const { test, expect } = require('@playwright/test');

test.describe('Widgets DSFR', () => {
  test.beforeEach(async ({ page }) => {
    // Servir les fichiers localement
    await page.goto('http://localhost:8000/examples/');
  });

  test('Dashboard SignalConso - Chargement complet', async ({ page }) => {
    await page.goto('http://localhost:8000/examples/signalconso-dashboard-dsfr.html');
    
    // Vérifier le chargement du DSFR
    await expect(page.locator('.fr-container')).toBeVisible();
    
    // Vérifier la présence des widgets
    await expect(page.locator('.fr-table')).toBeVisible();
    await expect(page.locator('.fr-card')).toHaveCount(4, { timeout: 10000 });
  });

  test('Widget Table - Tri et pagination', async ({ page }) => {
    await page.goto('http://localhost:8000/examples/signalconso-table-001.html');
    
    // Vérifier le tri
    await page.click('th:has-text("Date")');
    await expect(page.locator('tr').first()).toContainText('2024');
    
    // Vérifier la pagination
    const paginationButtons = page.locator('.fr-pagination__link');
    await expect(paginationButtons).toHaveCount(5, { minimum: 3 });
  });

  test('Accessibilité RGAA', async ({ page }) => {
    await page.goto('http://localhost:8000/examples/signalconso-dashboard-dsfr.html');
    
    // Test de navigation au clavier
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
    
    // Vérifier les attributs ARIA
    const tables = await page.locator('.fr-table').all();
    for (const table of tables) {
      await expect(table).toHaveAttribute('role', 'table');
    }
  });

  test('Performance - Temps de chargement', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:8000/examples/signalconso-dashboard-dsfr.html');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Le dashboard doit charger en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });
});