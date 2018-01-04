Telstra Media Home Page Mobile Version
====================

This is the POC of Telstra Media Home Page


### Goal 

To provide the code base of Mobile AEM for Telstra Media Home Page.


### Requirements

- AEM 6.2
- [Apache Maven](https://maven.apache.org/) version `>=3.2.5`
- [node.js](http://nodejs.org/) version `>=4.3.0`
- [PhoneGap CLI](https://github.com/phonegap/phonegap-cli) version `>=6.3.0` (install exact version with `npm install -g phonegap@6.3.0`)
- (iOS only) Xcode version `>=7.3.1`
- (iOS only) [ios-deploy](https://github.com/phonegap/ios-deploy) 
- (Android only) [Android SDK](https://developer.android.com/sdk/index.html)


### Get started

Clone this repository to your machine to begin.



### Install

This project is based on the [multimodule-content-package-archetype](http://dev.day.com/content/docs/en/aem/6-0/develop/how-tos/vlt-mavenplugin.html#multimodule-content-package-archetype) (with the bundle removed for simplicity), so it contains the same helpful profiles and properties to build and deploy your project with maven.

From the project root, run:

    mvn -PautoInstallPackage clean install 

... to build *all* the content packages and install to a AEM instance. The CRX host and port can be specified on the command line with `mvn -Dcrx.host=otherhost -Dcrx.port=5502 <goals>`

### Template Only

An app template only install option is also available. This option will only install the starter kit core components and an associated app template.
Once the template only option has been installed instances of the starter kit can be created by accessing the *Create App* action of the AEM Apps console.

From the project root, run:

    mvn -PautoInstallTemplate clean install 

- Navigate to the [AEM Apps console](http://localhost:4502/aem/apps.html/content/mobileapps)
- Select *Create* menu option
- Select *Create App*
- Choose the *Starter Kit* template
- Complete the wizard


# Sanctification
This is just a name, :)
