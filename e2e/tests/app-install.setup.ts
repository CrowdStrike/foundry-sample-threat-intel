import { test as setup } from '../src/fixtures';

// Ensure app is installed and ready for testing
// This setup runs once before all tests
setup('ensure Threat Intelligence Extension app is ready', async ({ appCatalogPage, appName }) => {
  // Check if app is already installed
  const isInstalled = await appCatalogPage.isAppInstalled(appName);

  if (!isInstalled) {
    console.log(`App '${appName}' is not installed. Installing...`);
    const installed = await appCatalogPage.installApp(appName);

    if (!installed) {
      throw new Error(
        `Failed to install app '${appName}'. Please ensure the app is deployed.\n` +
        'You can deploy manually with: foundry apps deploy'
      );
    }

    console.log(`✅ App '${appName}' installation completed`);
    console.log('Note: The app catalog may take time to reflect installation status.');
    console.log('The extension test will verify if installation was actually successful.');
  } else {
    console.log(`✅ App '${appName}' is already installed`);
  }
});
