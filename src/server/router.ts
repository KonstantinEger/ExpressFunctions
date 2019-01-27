import * as express from 'express';
import functions from './functions/functions';
import events from './events/events';

export interface IRouterOptions {

  events: boolean;
  functions: Function[]

}

export default function Router(options: IRouterOptions) {

  const router = express.Router();
  router.use(express.json());
  
  router.get('/_exprfn/connect', (req, res) => {
    res.json({msg: 'connected'});
  });

  if (options.functions) {
    const fns = options.functions;
    router.use('/_exprfn', functions(fns));
  }

  if (options.events) {
    router.use('/_exprfn', events());
  }

  return router;

}
