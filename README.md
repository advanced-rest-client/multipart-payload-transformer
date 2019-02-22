[![Published on NPM](https://img.shields.io/npm/v/@api-components/multipart-payload-transformer.svg)](https://www.npmjs.com/package/@api-components/multipart-payload-transformer)

[![Build Status](https://travis-ci.org/advanced-rest-client/multipart-payload-transformer.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/multipart-payload-transformer)  

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/multipart-payload-transformer)

# multipart-payload-transformer

An element that contains methods to transform FormData object into Multipart
message and ArrayBuffer

### Example

```html
<multipart-payload-transformer form-data="[[formData]]"></multipart-payload-transformer>
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @api-components/multipart-payload-transformer
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/multipart-payload-transformer/multipart-payload-transformer.js';
    </script>
  </head>
  <body>
    <multipart-payload-transformer></multipart-payload-transformer>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@api-components/multipart-payload-transformer/multipart-payload-transformer.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <multipart-payload-transformer form-data="[[formData]]"></multipart-payload-transformer>
    `;
  }

  static get properties() {
    return {
      formData: Object
    }
  }

  constructor() {
    super();
    const fd = new FormData();
    fd.add('test', 'value');
    this.formData = fd;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/multipart-payload-transformer
cd multipart-payload-transformer
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
