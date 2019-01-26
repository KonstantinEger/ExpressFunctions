const EventManager = require('./EventManager');

function events(eventFns) {
  const router = require('express').Router();
  const evtMngr = new EventManager();

  router.post('/event/on', (req, res) => {

    if (evtMngr.exists(req.body.event)) {
      evtMngr.addListener(req.body.event, {req, res});
    } else {
      // add new event
    }
    res.send({ data: { msg: req.body } });
  });

  return router;
}

module.exports = events;