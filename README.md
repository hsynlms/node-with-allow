# withAllow
> A route handler wrapper for [Express](https://github.com/expressjs/express) to check if the requested HTTP method are allowed for the route.

[![Downloads](https://img.shields.io/npm/dm/with-allow.svg)](https://npmjs.com/with-allow)
[![install size](https://packagephobia.com/badge?p=with-allow)](https://packagephobia.com/result?p=with-allow)

## Install
```
$ npm install with-allow --save
```

## Usage

```js
import express from 'express'
import withAllow from 'with-allow'

const app = express()

const routeHandler =
  (req, res) => {
    res.send(`${req.method} works!`)
  }

// other HTTP method requests such as POST, PUT etc., will throw 405 HTTP error
app.get('/', withAllow(routeHandler, ['GET']))

app.listen(3000, () => {
  console.log('Express server is running on port: 3000')
})

// http://localhost:3000 -> will print out "GET works!"
```

## Next.js

It is also possible to use `withAllow` in [Next.js](https://github.com/vercel/next.js/) API routes. There is an example following.

```js
// Next.js API route example
function handler(req, res) {
  // API route handler
}

export default withAllow(handler, ['POST'])
```

## Options

| Name                   | Type              | Default        | Description                                                                    |
| ---                    | ---               | ---            | ---                                                                            |
| handler                | `function`        | -              | The original Express.js route handler                                          |
| allowedMethods         | `string[]` or `*` | `[]`           | Allowed HTTP method list for the route handler. Left blank to disallow all the HTTP methods. Pass asterisk (*) to allow all the HTTP methods. |
