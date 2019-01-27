# Express Functions
_An expressjs library for making it easy to connect backend and frontend of modern web applications with functions._

- [Getting Started](#getting-started)
- [Using Events](#using-events)
- Docs
  - [Back-End](#backend-docs)
  - [Front-End](#frontend-docs)

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
// we're not gonna use events now
app.use(exprFn({
  events: false,
  functions: require('./functions')
}));

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
For the frontend we need to add the frontend file. You can find it at the releases
tab on [github.com](https://github.com/KonstantinEger/ExpressFunctions/releases/latest).
Just download the file or use a CDN (used in the example).

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
  <!-- Add express-functions script -->
  <script src="https://unpkg.com/express-functions/src/public/expr-fn.js"></script>

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

## Using Events
> If you want to use events, we need to set-up a bit more mostly on the front-end.
### First, on the back-end
````js
// app.js

// ...

app.use(exprFn({  // when configuring ExpressFunctions, change the
  events: true    // events attribute to: "true"
}));              // boom, thats all

// ...
````
### The Front-End
> Lets trigger an event and catch it again. This doesn't make much sense if it happens on the same page, but it gets the point across...So lets edit the index.html file:
````html
<!-- ./public/index.html -->

<!-- ... -->
<body>
  <h1 id="output"></h1>

  <script src="https://unpkg.com/express-functions/src/public/expr-fn.js"></script>

  <script>
    main();

    async function main() {
      const backend = await exprfn.connect();

      // listen for the myMessage-Event ...
      backend.on('myMessage', (resp) => {
        // ... and output the result
        document.getElementById('output').innerHTML = resp.msg;
      });

      // use .once and .then if you the event only happens once:

      // backend.once('myMessage')
      //   .then(resp => {
      //     document.getElementById('output').innerHTML = resp.msg;
      //   });

      // lets emit the event every second
      setInterval(() => {
        const randInt = Math.floor(Math.random() * 10);
        backend.emit('myMessage', { msg: `RandInt: ${randInt}` });
      }, 1000);
    }
  </script>
</body>
<!-- ... -->
````
> And as expected, every second a new number appears on the screen.

## Backend Docs

The `express-functions` package exposes a function to use. Add it to express
via `app.use(require('express-functions')(/* options */));`.

#### Options
- `events` (Boolean): `true` if you want to use events, `false` if not.
- `functions` (Object)[optional]: if specified, enter an object with functions
as attributes. You can call these functions by their name from the front-end
later. Use object-destructuring for parameters.

````js
app.use(require('express-functions')({
  events: true,
  // example
  functions: {
    add({ num1, num2 }) {
      return num1 + num2;
    }
  }
}));
````

## Frontend Docs

- #### `exprfn.connect([backend-domain])`
Call this function to connect your front-end application with your back-end. This
is an async function, so I advise to use it like this:
````js
const backend = await exprfn.connect();
````
The connect function takes the domain of your back-end server as an
optional argument: `await exprfn.connect('https://your.domain.com');`

It returns an object with the following functions:

- #### `.call({functionName}, [functionParams])`
The call function lets you call functions which you specified in your
express-functions configuration on your server. __This is an async function.__
The `functionName` is a required parameter (string). The `functionParams` (object)
obviously depend on the function you specified on your server.

````js
console.log(backend.call('add', { a: 5, b: 3 })) // => 8
````

- #### `.once({eventName})`
The `once` function is used with events. With this you listen for an event
with the given `eventName` (string). __This is an async function.__ The data
which the event is triggered with will get resolved once.

````js
// example
backend.once('someDudeLoggedIn')
  .then(data => {
    alert(`User ${data.name} just logged in`);
  })
````

- #### `.on({eventName}, {callback});`
The `on` function is used with events. With this you can listen for events
beeing fired off multiple times.

````js
// example
backend.on(`message:from:${friend.name}`, (data) => {
  alert(`Message from ${friend.name}: ${data.msg}`);
})
````

- #### `.emit({eventName}, [data]);`
The emit function will trigger an event on the server. Every request
for listening to this `eventName` (string) will get resolved. The optional
`data` (object) will be passed to the receiver if provided.

````js
// sender
backend.emit(`msg:from:${myToken}:to:${friendsToken}`, { msg: 'Hello' });
````

````js
// receiver
backend.on(`msg:from:${friendsToken}:to:${myToken}`, (data) => {
  alert(`Message from ${friend.name}: ${data.msg}`);
});
````
