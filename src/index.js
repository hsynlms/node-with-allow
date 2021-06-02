/**
 * Returns an Express.js route handler which checks if the request method is in allowed list.
 * If not, 405 HTTP Error thrown, otherwise the original handler will be invoked.
 * @typedef {import('express').request} request
 * @typedef {import('express').response} response
 * @param {function} handler The original Express.js route handler.
 * @param {String[]|'*'} [allowedMethods=[]] Allowed HTTP method list for the route handler.
 * Left blank to disallow all the HTTP methods. Pass asterisk (*) to allow all the HTTP methods.
 * @returns {Promise<(req: request, res: response)>} A handler which checks if the HTTP method is allowed for the handler.
 * @public
 */
export default function withAllow (handler, allowedMethods = []) {
  if (allowedMethods) {
    if (allowedMethods !== '*' && !Array.isArray(allowedMethods)) {
      throw new Error(`"allowedMethods" is expected to be an array but got: ${typeof allowedMethods}`)
    }

    if (Array.isArray(allowedMethods) && !allowedMethods.every(x => typeof x === 'string')) {
      throw new Error('Items of "allowedMethods" can only be string')
    }

    if (typeof allowedMethods === 'string' && allowedMethods !== '*') {
      throw new Error('It is not allowed to use anything other than asterisk (*) for "allowedMethods"')
    }
  }

  return async (req, res) => {
    if (allowedMethods &&
        Array.isArray(allowedMethods) &&
        !allowedMethods.find(x => x.toLowerCase() === req.method.toLowerCase())
    ) {
      res.set(
        'Allow',
        allowedMethods
          .map(x => x.toUpperCase())
          .join(', ')
      )

      // 405 => method not allowed
      return res.sendStatus(405)
    }

    return await handler(req, res)
  }
}
