import express from 'express'
import request from 'supertest'
import test from 'ava'

import withAllow from './src/index.js'

const generateExpress =
  () => {
    const app = express()
    return app
  }

// test cases

test('express only one request method allowed', async t => {
  const app = generateExpress()
  const ok = 'This request is allowed.'
  const handler =
    (req, res) => {
      return res.send(ok)
    }

  app.all('/', withAllow(handler, ['GET']))

  let result = await request(app).get('/')
  t.is(result.text, ok)

  result = await request(app).post('/')
  t.is(result.statusCode, 405)

  result = await request(app).put('/')
  t.is(result.statusCode, 405)

  result = await request(app).patch('/')
  t.is(result.statusCode, 405)

  result = await request(app).delete('/')
  t.is(result.statusCode, 405)
})

test('express all request methods are allowed', async t => {
  const app = generateExpress()
  const ok = 'Bana dedi rica ederim dedi.'
  const handler =
    (req, res) => {
      return res.send(ok)
    }

  app.all('/', withAllow(handler, '*'))

  let result = await request(app).get('/')
  t.is(result.text, ok)

  result = await request(app).post('/')
  t.is(result.text, ok)

  result = await request(app).put('/')
  t.is(result.text, ok)

  result = await request(app).patch('/')
  t.is(result.text, ok)

  result = await request(app).delete('/')
  t.is(result.text, ok)
})

test('express all request methods are disallowed', async t => {
  const app = generateExpress()
  const ok = 'Sidar.'
  const handler =
    (req, res) => {
      return res.send(ok)
    }

  app.all('/', withAllow(handler))

  let result = await request(app).get('/')
  t.is(result.statusCode, 405)

  result = await request(app).post('/')
  t.is(result.statusCode, 405)

  result = await request(app).put('/')
  t.is(result.statusCode, 405)

  result = await request(app).patch('/')
  t.is(result.statusCode, 405)

  result = await request(app).delete('/')
  t.is(result.statusCode, 405)
})

test('passing string (other than asterisk) to "allowedMethods"', async t => {
  const handler =
    (req, res) => {
      return res.send('OK')
    }

  t.throws(
    () => {
      withAllow(handler, 'Meymun')
    }
  )
})
