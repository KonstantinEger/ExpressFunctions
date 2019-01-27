import { Router } from "express-serve-static-core";

export default function expressFunctions(options: IExprFnOptions): Router;

interface IExprFnOptions {
  events: boolean;
  functions: Function[]
}