import { Page, expect, FrameLocator } from '@playwright/test';
import { SocketNavigationPage } from './SocketNavigationPage';

/**
 * Page object for testing the "Threat intelligence analysis" UI extension
 * Extension appears in activity.detections.details socket
 */
export class ThreatIntelExtensionPage extends SocketNavigationPage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToExtension(): Promise<void> {
    return this.withTiming(
      async () => {
        // Navigate to endpoint detections (activity.detections.details socket)
        // Note: This assumes the app is already installed by the setup test
        await this.navigateToEndpointDetections();

        // Open first detection to show details panel with extensions
        await this.openFirstDetection();

        // Wait for detection details panel to fully load
        await this.page.waitForLoadState('networkidle');

        // Additional wait to ensure extensions have time to render
        await this.waiter.delay(2000);

        this.logger.success('Navigated to detection with threat intel extension');
      },
      'Navigate to Threat Intel Extension'
    );
  }

  async verifyExtensionRenders(): Promise<void> {
    return this.withTiming(
      async () => {
        this.logger.info('Verifying threat intelligence extension renders');

        // Wait for detection details panel to load
        await this.page.waitForLoadState('networkidle');
        await this.waiter.delay(2000);

        // Look for the extension button
        const extensionButton = this.page.getByRole('button', {
          name: /Threat intelligence analysis/i
        });

        // Playwright automatically scrolls the element into view when needed
        await extensionButton.scrollIntoViewIfNeeded();
        await extensionButton.waitFor({ state: 'visible', timeout: 15000 });
        this.logger.info('Found threat intelligence analysis button');

        // Click to expand if needed
        const isExpanded = await extensionButton.getAttribute('aria-expanded');
        if (isExpanded === 'false') {
          await extensionButton.click();
          this.logger.info('Clicked to expand threat intelligence extension');
        }

        // Verify iframe loads
        await expect(this.page.locator('iframe')).toBeVisible({ timeout: 15000 });
        this.logger.info('Extension iframe loaded');

        // Check if API configuration is needed (first time setup)
        await this.configureAPIIfNeeded();

        // Verify iframe content
        const iframe: FrameLocator = this.page.frameLocator('iframe');

        // Check for File malware metadata section
        const malwareSection = iframe.getByText(/File malware metadata/i);
        await expect(malwareSection).toBeVisible({ timeout: 10000 });
        this.logger.info('Found "File malware metadata" section');

        // Check for Indicators of compromise section
        const iocSection = iframe.getByText(/Indicators of compromise/i);
        await expect(iocSection).toBeVisible({ timeout: 10000 });
        this.logger.info('Found "Indicators of compromise" section');

        this.logger.success('Threat intelligence extension renders correctly with expected sections');
      },
      'Verify threat intelligence extension renders'
    );
  }

  /**
   * Configure API credentials if the extension requires them
   */
  private async configureAPIIfNeeded(): Promise<void> {
    this.logger.info('Checking if API configuration is required...');

    const iframe: FrameLocator = this.page.frameLocator('iframe');

    // Check if there are input fields (indicating API configuration is needed)
    const inputFields = iframe.locator('input[type="text"]');
    const count = await inputFields.count();

    if (count === 0) {
      this.logger.info('No API configuration required - extension already configured');
      return;
    }

    this.logger.info('API configuration required, filling in Falcon API credentials');

    // Verify environment variables are set
    const falconClientId = process.env.FALCON_CLIENT_ID;
    const falconClientSecret = process.env.FALCON_CLIENT_SECRET;

    if (!falconClientId || !falconClientSecret) {
      const falconBaseUrl = process.env.FALCON_BASE_URL || 'https://falcon.crowdstrike.com';
      throw new Error(
        'FALCON_CLIENT_ID and FALCON_CLIENT_SECRET environment variables must be set for API configuration.\n' +
        `Please create an API client at: ${falconBaseUrl}/api-clients-and-keys/clients\n` +
        'Required scopes: Malware Analysis (malquery:read), IOCs - Indicators of Compromise (iocs:read)'
      );
    }

    if (falconClientId.trim() === '' || falconClientSecret.trim() === '') {
      throw new Error('FALCON_CLIENT_ID and FALCON_CLIENT_SECRET environment variables cannot be blank');
    }

    // Fill in configuration fields
    const nameField = iframe.locator('input[type="text"]').first();
    await nameField.fill('CrowdStrike Intelligence API');
    this.logger.debug('Filled Name field');

    // Infer API base URL from FALCON_BASE_URL
    const falconBaseUrl = process.env.FALCON_BASE_URL || 'https://falcon.us-2.crowdstrike.com';
    const apiBaseUrl = falconBaseUrl.replace('falcon.', 'api.');

    const baseUrlField = iframe.locator('input[type="text"]').nth(1);
    await baseUrlField.fill(apiBaseUrl);
    this.logger.debug(`Filled BaseURL field with ${apiBaseUrl}`);

    const clientIdField = iframe.locator('input[type="text"]').nth(2);
    await clientIdField.fill(falconClientId);
    this.logger.debug('Filled Client ID field');

    const clientSecretField = iframe.locator('input[type="text"]').nth(3);
    await clientSecretField.fill(falconClientSecret);
    this.logger.debug('Filled Client secret field');

    // Fill permissions field - multiselect combobox
    // Required scopes for threat intel: malquery:read (Malware Analysis) and iocs:read (Indicators of Compromise)
    const permissions = ['malquery:read', 'iocs:read'];

    for (const permission of permissions) {
      // Dispatch events to open the dropdown
      await this.page.evaluate(() => {
        const iframe = document.querySelector('iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentDocument) {
          const input = iframe.contentDocument.querySelector('[data-test-selector="form-multiselect"] input[data-test-selector="input"]') as HTMLInputElement;
          if (input) {
            input.focus();
            input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            input.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', bubbles: true }));
          }
        }
      });

      // Wait for dropdown to open and option to appear
      const option = iframe.getByRole('option', { name: permission });
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();

      this.logger.debug(`Selected permission: ${permission}`);
    }

    this.logger.debug('Filled Permissions field with required API scopes');

    // Wait for form to settle
    await this.page.waitForLoadState('networkidle');

    this.logger.success('API configuration completed');
  }

  async takeExtensionScreenshot(filename: string): Promise<void> {
    await this.takeScreenshot(filename);
  }
}
