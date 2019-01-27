import { Request, Response } from 'express-serve-static-core/index';

export default class Event {

  private name: string;
  private listeners: IListener[] = [];

  constructor(name: string) {

    this.name = name;

  }

  public getName(): string {

    return this.name;

  }

  public getListeners(): IListener[] {

    return this.listeners;

  }

  public pushListener(listener: IListener) {

    this.listeners.push(listener);

  }

  public dispatch(data: any): void {

    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i].res.send({ data });
    }

  }

  public setListeners(listeners: IListener[]) {

    this.listeners = listeners;

  }

}

export interface IListener {

  req: Request;
  res: Response

}
