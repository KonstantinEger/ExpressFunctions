function Router(options) {
  const express = require('express');
  const router = express.Router();
  router.use(express.json());
  
  router.get('/_exprfn/connect', (req, res) => {
    res.send({ msg: 'connected' });
  });

  if (options.functions) {
    const fns = options.functions;
    router.use('/_exprfn', require('./functions')(fns));
  }

  if (options.events) {
    const eventfns = options.events;
    router.use('/_exprfn', require('./events')(eventfns));
  }

  return router;
}

module.exports = Router;