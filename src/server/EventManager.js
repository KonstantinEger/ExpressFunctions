class EventManager {
  constructor() {
    this._events = [];
  }

  addListener(eventName, listener) {
    const result = this._events.find(e => e.name === eventName);
    result.listeners.push(listener);
  }

  exists(eventName) {
    const result = this._events.find(e => e.name === eventName);
    if (result) return true;
    else return false;
  }

  push(event) {
    this._events.push(event);
  }
}

module.exports = EventManager;
