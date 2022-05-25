# Saksoff5th Client

## Prerequisites

* First download and install Git [Install Tutorial](https://www.atlassian.com/git/tutorials/install-git)
* Install [Node](https://nodejs.org/en/download/) v14.17.3 or use [NVM](https://github.com/nvm-sh/nvm) (node-version-manager) manage the Node versions installed on your system

## How to run this project

* install the pre-requisites
* clone this repository using `git clone https://github.com/cristiantoptive/saksoff5th_client.git` or `git clone git@github.com:cristiantoptive/saksoff5th_client.git`
* install project dependencies using Yarn or NPM by running `npm install` or `yarn install`
* configure the local proxy for the API server ([HOW TO](#how-to-configure-app-proxy))
* run the development server by running `npm run dev`
* open your browser and navigate to http://localhost:4200 and verify that the app is running correctly.

## How to configure app proxy

This client depends on [Saksoff5th API](https://github.com/cristiantoptive/saksoff5th_api.git) to work and could be necessary to configure the Angular local proxy to match your API setup host and port on the file `proxy.conf.js` located at the repository root folder.

To configure the proxy server change the default value for the const `API_URL` to the URL where the API is running.

```
const API_URL = process.env.API_URL || "http://localhost:3000";

const PROXY_CONFIG = {
  "/api/*": {
    target: API_URL,
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
```

## Client Architecture

This app is written using [TypeScript](https://www.typescriptlang.org/) and the [Angular 12.x](https://angular.io/) framework.

### Folder Structure

* `./src` includes all the source code, the main and index file where the app bootstraps the main module
  * `./src/app` includes the main module and the lazy loaded modules routes declarations for each submodule
    * `./src/app/infrastructure` services, interfaces, viewmodels, commands, helpers and interceptors are declared here. Viewmodels and commands matches the ones declares on the API
    * `./src/app/material` here are declared the used modules provided by Angular Material library
    * `./src/app/modules`
      * `./src/app/modules/auth` authentication module, includes the signin and signup components
      * `./src/app/modules/addresses` user addresses module, defines add, edit and list components
      * `./src/app/modules/cards` user cards module, defines add, edit and list components
      * `./src/app/modules/orders` user orders module, defines add and list components
      * `./src/app/modules/cart` cart modules defines the component used on the current cart view
      * `./src/app/modules/catalog` products catalog module, main module which has the view for all the products available for ordering
      * `./src/app/modules/users` users module, only accessible by Admin user, includes add, edit and list components
      * `./src/app/modules/categories` products categories module, only accessible by Admin user, includes add, edit and list components
      * `./src/app/modules/products` products module, only accessible by Merchandiser user, allows to add, edit and list merchandiser products
      * `./src/app/modules/vendors` vendors module, only accessible by Merchandiser user, allows to add, edit and list merchandiser vendors
    * `./src/app/shared`
      * `./src/app/shared/components` contains all the shared components like alerts, headers, spinners, popups and more
  * `./src/assets` images, icons and all the static files are here
  * `./src/environments` development and production environment setup files

## Available users for testing

* Admin:
  * Features: Manage Users and Product Categories
  * Users:
    * Admin 1
      * email: admin@admin.com
      * password: admin123

* Merchandisers:
  * Features: Manage their own Vendors and Products
  * Users:
    * Merchandiser 1
      * email: merchandiser1@merchandiser.com
      * password: merchandiser123

    * Merchandiser 2
      * email: merchandiser2@merchandiser.com
      * password: merchandiser123

* Customers:
  * Features: Manage their own Addresses, Cards and Orders
  * Users:
    * Customer 1
      * email: customer1@customer.com
      * password: customer123

    * Customer 2
      * email: customer3@customer.com
      * password: customer123

    * Customer 2
      * email: customer2@customer.com
      * password: customer123


### Demo videos

* [Admin demo](demo/admin_demo.mov)
* [Merchandiser demo](demo/merchandiser_demo.mov)
* [Customer demo](demo/customer_demo.mov)