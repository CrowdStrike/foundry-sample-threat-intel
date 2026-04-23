import { test, expect } from '../src/fixtures';

test.describe.configure({ mode: 'serial' });

test.describe('Threat Intelligence Extension Tests', () => {
  test('should navigate to endpoint detections and open first detection', async ({ page, detectionExtensionPage }) => {
    await detectionExtensionPage.navigateToDetectionDetails();
    expect(page.url()).toContain('detections');
  });
});
