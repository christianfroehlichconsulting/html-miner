HTML Miner
==========

[![Build Status](https://travis-ci.org/marcomontalbano/html-miner.svg?branch=master)](https://travis-ci.org/marcomontalbano/html-miner)


Install
-------

```sh
# using yarn
yarn add html-miner

# using npm
npm i --save html-miner
```


Example
-------

We have following html snippet and we want to fetch the `title`.

```html
<div class="jumbotron">
    <div class="container">
        <h1 class="display-3">Hello, world!</h1>
        <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
        <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more &raquo;</a></p>
    </div>
</div>
<div class="container">
    <div class="row">
        <div class="col-md-4">
            <h2>Heading</h2>
            <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
            <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
        </div>
        <div class="col-md-4">
            <h2>Heading</h2>
            <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
            <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
        </div>
        <div class="col-md-4">
            <h2>Heading</h2>
            <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
            <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
        </div>
    </div>

    <hr>

    <footer>
        <p>&copy; Company 2017</p>
    </footer>
</div>
```

```javascript
const htmlMiner = require('html-miner');

let json = htmlMiner(html, {
    title : 'h1',
    headings : 'h2',
    greet : $ => { return 'Hi!' }
});

console.log( json );
// {
//     title : 'Hello, world!',
//     headings : ['Heading', 'Heading', 'Heading'],
//     greet : 'Hi!'
// }
```


Development
-----------

```sh
yarn
yarn test
```
