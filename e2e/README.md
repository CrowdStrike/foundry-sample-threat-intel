# E2E Testing for Threat Intelligence Extension

This directory contains end-to-end (E2E) tests for the Threat Intelligence Detections Enrichment Foundry app using Playwright.

## Overview

These E2E tests verify that:
1. The Threat intelligence analysis extension renders correctly in detection details
2. The File malware metadata section displays properly
3. The Indicators of compromise section displays properly
4. Extension content loads from CrowdStrike Intelligence API

## Prerequisites

- Node.js 22 or higher
- Valid Falcon credentials with access to:
  - Endpoint Detections (activity.detections.details socket)
  - Malware API
  - IOC API
- MFA authenticator app configured for your Falcon account
- **Falcon API Client** with the following scopes:
  - **Malware Analysis:READ**
  - **IOCs (Indicators of Compromise):READ**

### Creating an API Client

1. Navigate to https://falcon.us-2.crowdstrike.com/api-clients-and-keys/clients
2. Click "Add new API client"
3. Enter a name (e.g., "E2E Testing - Threat Intel")
4. Select the following scopes:
   - Malware Analysis:READ
   - IOCs (Indicators of Compromise):READ
5. Click "Add" and save the Client ID and Client Secret

## Setup

### 1. Install Dependencies

```bash
cd e2e
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 3. Configure Environment Variables

Copy `.env.sample` to `.env` and fill in your credentials:

```bash
cp .env.sample .env
```

Edit `.env`:

```env
APP_NAME=foundry-sample-threat-intel
FALCON_BASE_URL=https://falcon.us-2.crowdstrike.com
FALCON_USERNAME=your-falcon-username
FALCON_PASSWORD=your-falcon-password
FALCON_AUTH_SECRET=your-mfa-secret
```

**Important Notes:**
- `APP_NAME` must match the app name in Falcon (typically matches the repo name)
- `FALCON_AUTH_SECRET` is your MFA TOTP secret (not the 6-digit code)
- Use the correct `FALCON_BASE_URL` for your cloud region

## Running Tests

### Local Testing

```bash
# Run all tests
npm test

# Run in UI mode (interactive)
npm run test:ui

# Run in debug mode
npm run test:debug

# Run with verbose logging
npm run test:verbose
```

### What the Tests Do

1. **Authentication Setup** (`authenticate.setup.ts`)
   - Logs into Falcon with MFA
   - Stores authentication state for tests

2. **Extension Tests** (`threat-intel-extension.spec.ts`)
   - Navigates to Endpoint Detections
   - Opens first available detection
   - Verifies Threat intelligence analysis extension renders
   - Checks File malware metadata section
   - Checks Indicators of compromise section
   - Takes screenshot for visual verification

## Test Architecture

### Page Objects

- `BasePage.ts` - Base class with common functionality
- `SocketNavigationPage.ts` - Navigation to pages with socket extensions
- `ThreatIntelExtensionPage.ts` - Threat intelligence extension interactions
- `FoundryHomePage.ts` - Foundry home and Custom Apps navigation
- `AppCatalogPage.ts` - App installation from catalog
- `AppManagerPage.ts` - App management operations

### Utilities

- `Logger.ts` - Structured logging
- `SmartWaiter.ts` - Intelligent waiting and retry strategies
- `TestConfig.ts` - Centralized configuration management

### Fixtures

- `fixtures.ts` - Playwright fixtures for dependency injection

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to main branch
- Pull requests to main
- Manual workflow dispatch

The CI workflow:
1. Deploys the app with a unique name
2. Runs E2E tests
3. Uploads test results and screenshots as artifacts
4. Cleans up the deployed app

## Test Data

The extension requires:
- **Real detections** in your Falcon instance
- Detection data must include file hashes that exist in CrowdStrike Intelligence APIs
- No test data can be created - tests verify rendering with available detection data

## Troubleshooting

### App Not Found

If tests fail with "app not found":
1. Verify `APP_NAME` in `.env` matches the deployed app name in Falcon
2. Check the app is installed in Foundry > App catalog
3. Try renaming the app in Falcon to match `APP_NAME`

### Extension Not Rendering

If extension doesn't appear:
1. Ensure the app is properly deployed and released
2. Verify API credentials have Malware and IOC API scopes
3. Check that detections exist in your Falcon instance
4. Verify the detection has file information for API lookups

### Authentication Failures

If authentication fails:
1. Verify `FALCON_USERNAME` and `FALCON_PASSWORD` are correct
2. Confirm `FALCON_AUTH_SECRET` is the TOTP secret (not 6-digit code)
3. Check your MFA is properly configured in Falcon
4. Ensure `FALCON_BASE_URL` matches your cloud region

### No Detections Available

If tests fail because no detections are found:
1. This app requires real endpoint detection data
2. Tests will skip if no detections are available
3. Consider using a development/test environment with sample detections

## Test Coverage

### Current Coverage

- ✅ Extension rendering in detection details socket
- ✅ File malware metadata section verification
- ✅ Indicators of compromise section verification
- ✅ Screenshot capture for visual verification

### Limitations

- Cannot verify actual API data without real detections
- Cannot test with synthetic/fixture data
- Requires live Falcon environment with detection data

## Contributing

When adding new tests:
1. Follow the existing page object pattern
2. Use semantic locators (getByRole, getByText) over CSS selectors
3. Add appropriate logging and error handling
4. Update this README with new test coverage

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Foundry Documentation](https://falcon.crowdstrike.com/documentation/category/c3d64B8e/falcon-foundry)
- [CrowdStrike Intelligence API](https://falcon.crowdstrike.com/documentation/category/adb59bc5/crowdstrike-intelligence)
