import { test as baseTest } from '@playwright/test';
import { AppCatalogPage } from './pages/AppCatalogPage';
import { ThreatIntelExtensionPage } from './pages/ThreatIntelExtensionPage';
import { config } from './config/TestConfig';
import { logger } from './utils/Logger';

type FoundryFixtures = {
  appCatalogPage: AppCatalogPage;
  threatIntelExtensionPage: ThreatIntelExtensionPage;
  appName: string;
};

export const test = baseTest.extend<FoundryFixtures>({
  // Configure page with centralized settings
  page: async ({ page }, use) => {
    const timeouts = config.getPlaywrightTimeouts();
    page.setDefaultTimeout(timeouts.timeout);
    
    // Log configuration on first use
    if (!process.env.CONFIG_LOGGED) {
      config.logSummary();
      process.env.CONFIG_LOGGED = 'true';
    }
    
    await use(page);
  },

  // Page object fixtures with dependency injection
  appCatalogPage: async ({ page }, use) => {
    await use(new AppCatalogPage(page));
  },

  threatIntelExtensionPage: async ({ page }, use) => {
    await use(new ThreatIntelExtensionPage(page));
  },


  // App name from centralized config
  appName: async ({}, use) => {
    await use(config.appName);
  },
});

export { expect } from '@playwright/test';