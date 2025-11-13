import { test, expect } from '../src/fixtures';

test.describe.configure({ mode: 'serial' });

test.describe('Threat Intelligence Extension Tests', () => {
  test('should render threat intelligence extension', async ({ threatIntelExtensionPage }) => {
    // Navigate to extension (this will install app if needed)
    await threatIntelExtensionPage.navigateToExtension();

    // Verify extension renders correctly
    await threatIntelExtensionPage.verifyExtensionRenders();
  });
});
