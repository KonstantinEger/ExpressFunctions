const express = require('express');

function router(fns) {
  const router = express.Router();
  router.use(express.json());
  
  router.get('/_exprfn/connect', (req, res) => {
    res.send({ msg: 'connected' });
  });

  router.post('/_exprfn/fn', (req, res) => {

    const fnName = req.body.fnName;
    const params = req.body.params;

    if (!fns[fnName]) {
      res.json({
        status: 'ERR',
        errCode: '01',
        msg: `Function "${fnName}" does not exist`
      });
      return;
    }

    let result;
    try {
      result = fns[fnName](params);
    } catch (error) {
      res.json({
        status: 'ERR',
        errCode: '02',
        msg: 'Error while executing function',
        errMsg: error.toString()
      });
      return;
    }

    res.json({
      status: 'DONE',
      result
    });
  });

  return router;
}

module.exports = router;