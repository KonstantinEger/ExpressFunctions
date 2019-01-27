import Event, { IListener } from './Event';

export default class EventManager {

  private events: Event[];

  constructor() {
    this.events = [];
  }

  addListener(eventName: string, listener: IListener): void {

    const result = this.events.filter((e: Event) => e.getName() === eventName);
    result[0].pushListener(listener);

  }

  exists(eventName: string): boolean {

    const result = this.events.filter((e: Event) => e.getName() === eventName);
    if (result[0]) return true;
    else return false;

  }

  push(eventName: string, listener: IListener) {

    const e = new Event(eventName);
    e.pushListener(listener);
    this.events.push(e);
    return e;

  }

  dispatchEvent(eventName: string, data: any) {

    const result = this.events.filter((e: Event) => e.getName() === eventName);
    result[0].dispatch(data);
    result[0].setListeners([]);

  }

}
