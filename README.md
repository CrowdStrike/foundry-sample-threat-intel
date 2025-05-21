![CrowdStrike Falcon](/docs/asset/cs-logo.png?raw=true)

# Threat Intelligence Detections Enrichment sample Foundry app

The Threat Intelligence Detections Enrichment sample Foundry app is a community-driven, open source project which serves as an example of an app which can be built using CrowdStrike's Foundry ecosystem.
`foundry-sample-threat-intel` is an open source project, not a CrowdStrike product. As such, it carries no formal support, expressed or implied.

This app is one of several App Templates included in Foundry that you can use to jumpstart your development. It comes complete with a set of
preconfigured capabilities aligned to its business purpose. Deploy this app from the Templates page with a single click in the Foundry UI, or
create an app from this template using the CLI.

> [!IMPORTANT]  
> To view the documentation links and deploy this app, you need access to the Falcon console.

## Description

The Threat Intelligence Detections Enrichment app is a no-code sample application built on CrowdStrike's Foundry platform. It demonstrates how developers can enhance Falcon's endpoint detection capabilities by integrating additional threat intelligence data directly into the user interface.

### Features

- Integrates data from two Falcon API endpoints:
  - Malware API
  - Indicators of Compromise (IOC) API
- Adds a custom widget to the endpoint detections screen
- Provides enriched threat intelligence without requiring users to navigate away
- Built entirely using no-code capabilities in Foundry

## Usage

You can install this app from the Foundry Templates page in your CrowdStrike Falcon instance or you can deploy it from this codebase using Foundry CLI.

### Deploying from the Foundry UI

- Navigate to the Foundry Templates page in your CrowdStrike Falcon instance
- Search for Threat Intelligence Detections Enrichment
- Follow the on-screen prompts to complete installation
- Provide a Crowdstrike API key, you can create one in Support and resources > API clients and keys (scopes: Malware Analysis and IOCs)

### Deploying from the CLI

#### Install the Foundry CLI

You can install the Foundry CLI with Scoop on Windows or Homebrew on Linux/macOS.

**Windows**:

Install [Scoop](https://scoop.sh/). Then, add the Foundry CLI bucket and install the Foundry CLI.

```shell
scoop bucket add foundry https://github.com/crowdstrike/scoop-foundry-cli.git
scoop install foundry
```

Or, you can download the [latest Windows zip file](https://assets.foundry.crowdstrike.com/cli/latest/foundry_Windows_x86_64.zip), expand it, and add the install directory to your PATH environment variable.

**Linux and macOS**:

Install [Homebrew](https://docs.brew.sh/Installation). Then, add the Foundry CLI repository to the list of formulae that Homebrew uses and install the CLI:

```shell
brew tap crowdstrike/foundry-cli
brew install crowdstrike/foundry-cli/foundry
```

Run `foundry version` to verify it's installed correctly.

##### Clone repo and deploy

Clone this sample to your local system, or [download as a zip file](https://github.com/CrowdStrike/foundry-sample-threat-intel/archive/refs/heads/main.zip).

```shell
git clone https://github.com/CrowdStrike/foundry-sample-threat-intel
cd foundry-sample-threat-intel
```

Log in to Foundry:

```shell
foundry login
```

Select the following permissions:

- [ ] Create and run RTR scripts
- [ ] Create, execute and test workflow templates
- [x] Create, run and view API integrations
- [ ] Create, edit, delete, and list queries

Deploy the app:

```shell
foundry apps deploy
```

> [!TIP]
> If you get an error that the name already exists, change the name to something unique to your CID in `manifest.yml`.

Once the deployment has finished, you can release the app:

```shell
foundry apps release
```

Next, go to **Foundry** > **App catalog**, find your app, and install it. Select the **Open App** button in the success dialog.

> [!TIP]
> If the app doesn't load, reload the page.

## Foundry resources

- Foundry documentation: [US-1](https://falcon.crowdstrike.com/documentation/category/c3d64B8e/falcon-foundry) | [US-2](https://falcon.us-2.crowdstrike.com/documentation/category/c3d64B8e/falcon-foundry) | [EU](https://falcon.eu-1.crowdstrike.com/documentation/category/c3d64B8e/falcon-foundry)
- Foundry learning resources: [US-1](https://falcon.crowdstrike.com/foundry/learn) | [US-2](https://falcon.us-2.crowdstrike.com/foundry/learn) | [EU](https://falcon.eu-1.crowdstrike.com/foundry/learn)

---

<p align="center"><img src="https://raw.githubusercontent.com/CrowdStrike/falconpy/main/docs/asset/cs-logo-footer.png"><BR/><img width="300px" src="https://raw.githubusercontent.com/CrowdStrike/falconpy/main/docs/asset/adversary-goblin-panda.png"></P>
<h3><P align="center">WE STOP BREACHES</P></h3>
