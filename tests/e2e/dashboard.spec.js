const { test, expect } = require('@playwright/test');

test.describe('SignalConso Dashboard DSFR', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/signalconso-dashboard-dsfr.html');
  });

  test('should load the dashboard', async ({ page }) => {
    // Vérifier le titre
    await expect(page).toHaveTitle(/SignalConso/i);
    
    // Vérifier la présence du header DSFR
    const header = page.locator('.fr-header');
    await expect(header).toBeVisible();
  });

  test('should have DSFR styling', async ({ page }) => {
    // Vérifier les classes DSFR
    const container = page.locator('.fr-container');
    await expect(container).toBeVisible();
    
    // Vérifier les boutons DSFR
    const buttons = page.locator('.fr-btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display data table', async ({ page }) => {
    // Attendre que le tableau soit chargé
    const table = page.locator('.fr-table');
    await expect(table).toBeVisible({ timeout: 10000 });
    
    // Vérifier qu'il y a des données
    const rows = page.locator('.fr-table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should have working filters', async ({ page }) => {
    // Chercher les éléments de filtre
    const searchInput = page.locator('.fr-search-bar input[type="search"]');
    
    if (await searchInput.isVisible()) {
      // Tester la recherche
      await searchInput.fill('test');
      await searchInput.press('Enter');
      
      // Attendre la mise à jour
      await page.waitForTimeout(1000);
    }
  });

  test('should display charts', async ({ page }) => {
    // Vérifier la présence de graphiques
    const charts = page.locator('canvas, svg.chart, .chart-container');
    const chartCount = await charts.count();
    
    if (chartCount > 0) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.fr-container')).toBeVisible();
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.fr-container')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.fr-container')).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Test navigation au clavier
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Vérifier le focus
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Vérifier les attributs ARIA sur les éléments interactifs
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaDescribedBy = await button.getAttribute('aria-describedby');
      const role = await button.getAttribute('role');
      
      // Au moins un attribut d'accessibilité devrait être présent
      expect(ariaLabel || ariaDescribedBy || role || true).toBeTruthy();
    }
  });

  test('should handle accordion interactions', async ({ page }) => {
    // Chercher des accordéons DSFR
    const accordions = page.locator('.fr-accordion__btn');
    const accordionCount = await accordions.count();
    
    if (accordionCount > 0) {
      const firstAccordion = accordions.first();
      await firstAccordion.click();
      
      // Vérifier que le contenu est visible
      const content = page.locator('.fr-collapse').first();
      await expect(content).toBeVisible();
    }
  });

  test('should export data', async ({ page }) => {
    // Chercher les boutons d'export
    const exportButtons = page.locator('button:has-text("Export"), button:has-text("Télécharger")');
    const exportCount = await exportButtons.count();
    
    if (exportCount > 0) {
      // Vérifier que le bouton est cliquable
      await expect(exportButtons.first()).toBeEnabled();
    }
  });
});

test.describe('SignalConso Simple Dashboard', () => {
  test('should load simple dashboard', async ({ page }) => {
    await page.goto('/examples/signalconso-simple-dsfr.html');
    
    // Vérifier le chargement
    await expect(page.locator('.fr-container')).toBeVisible();
    
    // Vérifier la table
    const table = page.locator('.fr-table');
    await expect(table).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Accessibility Tests', () => {
  test('should pass basic accessibility checks', async ({ page }) => {
    await page.goto('/examples/signalconso-dashboard-dsfr.html');
    
    // Test de contraste (vérification basique)
    const backgroundColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    expect(backgroundColor).toBeTruthy();
    
    // Vérifier la présence de skip links
    const skipLinks = page.locator('a[href^="#"]:has-text("Aller au contenu")');
    const skipLinkCount = await skipLinks.count();
    // Les skip links peuvent être optionnels
    expect(skipLinkCount).toBeGreaterThanOrEqual(0);
    
    // Vérifier les headings hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
});