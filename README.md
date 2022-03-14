# Operand-JS

A component library for the Operand API.

# Install Operand-JS

```bash
npm i operand-js
```

Install our [npm package](https://www.npmjs.com/package/operand-js) that contains our component.

# Get SetIDs

> Note: Skip this step if you are a ‘managed’ user. We will send you everything you need.

You will need to specify which document sets you want to search over via their setID. You can find this by making an API request as detailed here in our [documentation](https://operand.ai/docs/document-sets) or by getting it from the URL in your dashboard.

You can list any number of document sets to be searched over in a given search component.

# Setup an API Key

> Note: Skip this step if you are a ‘managed’ user. We will send you everything you need.

Because this API key will be exposed client side we strongly recommend setting very specific scopes. For the Operand-JS to work at its most basic functionality is only requires the “search” scope on the setIDs that are specified in the component. If you want feedback functionality an additional feedback scope is required on those same sets.

Scopes are specified as “’scope’:’setid’” in a comma separated list during API Key creation.

# Adding the Component

First you need to import the component into your project.

```jsx
import { SearchBar } from 'operand-js';
```

Then you will create the component by providing the necessary properties.

```jsx
<SearchBar apiKey="Your APIKey" setIDs={['String Array of Document Set IDs']}>
  {'At Least One Child'}
</SearchBar>
```

## Required Properties

| Name     | Type            | Purpose                                                                    |
| -------- | --------------- | -------------------------------------------------------------------------- |
| apiKey   | string          | Access to Operand API                                                      |
| setIDS   | string[]        | Sets to search over with Operand API                                       |
| children | React.ReactNode | Rendering the search component. It will not render itself without a child. |

For your child we recommend rendering a fake search bar or just a search icon. It will be clickable to open the search modal.

## Optional Properties

```jsx
<SearchBar
  apiKey="Your APIKey"
  setIDs={['String Array of Document Set IDs']}
  placeholderText="Text you want shown in modal input"
  feedback={true}
  keyboardShortcut="A keyboard shortcut to open the modal"
>
  {'At Least One Child'}
</SearchBar>
```

| Name             | Type    | Purpose                                                                                    |
| ---------------- | ------- | ------------------------------------------------------------------------------------------ |
| placeholderText  | string  | Customize the input bar in the modal                                                       |
| feedback         | boolean | Sends us anonymous feedback about what results were clicked and helps improve your search. |
| keyboardShortcut | string  | Uses the react-hotkeys-hook package. See this section for how to define a shortcut.        |

For the keyboardShortcut an example is “ctrl+k”.

# Component Styling

Currently there is no custom styling for the component and we used tailwind to style the component.

## Non-Tailwind Projects:

We have provided a minified tailwind.css file that can be imported to style the component for non-tailwind projects.

```jsx
import 'operand-js/dist/tailwind.css';
```

## Tailwind Projects:

Projects with tailwind must simply include the node-module in the contents section of ‘tailwind.config.js’.

```json
module.exports = {
  content: [
		....
    "./node_modules/operand-js/dist/*.js",
  ],
	....
}
```

# Questions?

Send us a message at [support@operand.ai](mailto:support@operand.ai).
