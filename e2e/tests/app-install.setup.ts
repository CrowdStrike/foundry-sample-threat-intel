import { test as setup } from '@playwright/test';
import { AppCatalogPage, config } from '@crowdstrike/foundry-playwright';

setup('install app', async ({ page }) => {
  const catalog = new AppCatalogPage(page);

  const falconClientId = process.env.FALCON_CLIENT_ID;
  const falconClientSecret = process.env.FALCON_CLIENT_SECRET;
  const falconBaseUrl = process.env.FALCON_BASE_URL || 'https://falcon.us-2.crowdstrike.com';
  const apiBaseUrl = falconBaseUrl.replace('falcon.', 'api.');

  if (!falconClientId || !falconClientSecret) {
    throw new Error('FALCON_CLIENT_ID and FALCON_CLIENT_SECRET must be set');
  }

  await catalog.installApp(config.appName, {
    configureSettings: async (page) => {
      await page.getByLabel('Name').fill('CrowdStrike Intelligence API');
      await page.getByLabel('BaseURL').fill(apiBaseUrl);
      await page.getByLabel('Client ID').fill(falconClientId);
      await page.getByLabel('Client secret').fill(falconClientSecret);

      const permissionsCombobox = page.getByRole('combobox', { name: 'Permissions' });
      for (const permission of ['malquery:read', 'iocs:read']) {
        await permissionsCombobox.click();
        await page.getByRole('option', { name: permission }).click();
      }
    },
  });
});
