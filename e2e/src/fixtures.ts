import { test as baseTest } from '@playwright/test';
import { AppCatalogPage, DetectionExtensionPage, config } from '@crowdstrike/foundry-playwright';

type FoundryFixtures = {
  appCatalogPage: AppCatalogPage;
  detectionExtensionPage: DetectionExtensionPage;
  appName: string;
};

export const test = baseTest.extend<FoundryFixtures>({
  appCatalogPage: async ({ page }, use) => {
    await use(new AppCatalogPage(page));
  },
  detectionExtensionPage: async ({ page }, use) => {
    await use(new DetectionExtensionPage(page));
  },
  appName: async ({}, use) => {
    await use(config.appName);
  },
});

export { expect } from '@playwright/test';
