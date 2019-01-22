# Express Functions
_An expressjs library for making it easy to connect backend and frontend of modern web applications with functions._

## Getting started
>First, we need to setup our backend.
### Backend
> Install express and express-functions
````bash
$ npm install express express-functions
````
> Create our server files
````js
// ./app.js

const express = require('express');
const path = require('path');
const exprFn = require('express-functions');

const app = express();

// for serving the index.html and frontend js file
app.use(express.static(path.join(__dirname, '/public/')));

// import the server functions
app.use(exprFn(require('./functions.js')));

// start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Server is running'));
````
````js
// ./functions.js

// export an object with your functions
module.exports = {
  greet({ name }) {
    return `Hello ${name}, you're welcome!`;
  },
  add({ a, b }) {    // use object-destructuring for
    return a + b;    // parameters
  }
}
// ... thats it!
````
### Frontend
For the frontend we need to add the expr-fn.js file. You can find it in the source code
at `src/public/expr-fn.js`. Just download the file or copy the bit of code. In the future this should also be available via a CDN.<br><br>
For this project I saved it in `public/scripts/expr-fn.js`.

> Now the index.html file
````html
<!-- ./public/index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ExpressFunctions</title>
</head>
<body>
  <!-- Add express-functions to the page -->
  <script src="/scripts/expr-fn.js"></script>

  <script>
    // put the code in an async function
    async function main() {
      // connect to the backend
      const backend = await exprfn.connect();
      // call the add function (functions.js)
      const addResult = await backend.call('add', { a: 5, b: 3 });
      console.log(addResult);
      // call the greet function
      const msg = await backend.call('greet', { name: 'John Doe' });
      console.log(msg);
    }

    // call the main function
    main();
  </script>
</body>
</html>
````

> And thats all you got to do for getting your frontend and backend to communicate via functions. You can transfer data, work with it on the server and send it back to the user.