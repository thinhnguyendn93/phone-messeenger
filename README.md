

## Prerequisites

Ensure you have the necessary tools installed:

- Node.js 18.18 or higher
- yarn

## Project structure

```
├── assets
│   ├── icomoon             # Font icons
│   ├── styles              # Styles (Sass)
│   ├── images              # Image files ( SVG, PNG, JPG )
├── i18n                    # Translate languages
│   ├── en.json
│   ├── vi.json
├── dist                    # Build folder for dev-server watch source code
├── public                  # Build folder for deploy production
├── environments            # Deploy environments
├── src
├── components              # Vue Components
├── composables             # Composables
├── constants               # Define constants for app ( include by component view, modal view, etc... )
├── pages                   # Page view for each routes
├── stores                  # Root store for app
├── types                   # Define types for each module
├── utils                   # Define helper functions
├── .env                    # ENV config  ( API, APP_URL, NODE_ENV, PORT, etc... )
├── .eslint.config.mjs      # EsLint config
├── .nvmrc                  # Project nodejs version
├── .prettierignore         # Ignore validate Prettier some files
├── .prettierrc             # Prettier config
├── package.json
├── nuxt.config.ts          # Nuxt config
├── yarn.lock
└── ...
```

## Installation

### Step 1: Create `.npmrc` file

Create a `.npmrc` file in the root directory of your project and add the following line of code:

```plaintext
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
```

### Step 2: Setup token

Before installing the library, you need to set the `NPM_TOKEN` environment variable. You can do this by running the
following command in your terminal:

```sh
export NPM_TOKEN=${YOUR_NPM_TOKEN}
```

### Step 3: Run the application

```sh
yarn install
```

```sh
yarn dev
```

### Step 4: Build the application

```sh
yarn build
```

```sh
yarn start
```