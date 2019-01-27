import EventManager from './EventManager';
import { Router } from 'express';

export default function events() {

  const evtMngr = new EventManager();
  const router = Router();

  router.post('/event/on', (req, res) => {

    if (evtMngr.exists(req.body.event)) {
      evtMngr.addListener(req.body.event, { req, res });
    } else {
      evtMngr.push(req.body.event, { req, res });
    }

  });

  router.post('/event/emit', (req, res) => {

    if (evtMngr.exists(req.body.event)) {
      evtMngr.dispatchEvent(req.body.event, req.body.data);
      res.send({msg: 'dispatched'});
    }

  });

  return router;

}
