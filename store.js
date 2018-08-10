export default class Store {
  constructor(initialState) {
    this.state = initialState || {};
    this.actions = {};
    this.events = {};
    this.callbacks = [];
    this.triggerAction = this.triggerAction.bind(this);
  }

  triggerAction(name, ...args) {
    if (this.actions.hasOwnProperty(name)) {
      this.state = this.actions[name](this.state, ...args);

      this.callbacks.forEach(cb => {
        cb(this.state);
      });
    }

    if (this.events.hasOwnProperty(name)) {
      this.events[name].forEach(cb => {
        cb(this.state, this.triggerAction, ...args);
      });
    }

    return this;
  }

  action(action, mutator) {
    this.actions[action] = mutator;
    return this;
  }

  on(event, cb) {
    if (!this.events.hasOwnProperty(event)) {
      this.events[event] = [];
    }
    this.events[event].push(cb);

    return this;
  }

  off(event, cb) {
    const events = this.events[event].filter(item => item === cb);
    this.events[event] = events;
    return this;
  }

  connect(cb) {
    this.callbacks.push(cb);
    cb(this.state);
    return this;
  }

  disconnect(cb) {
    const callbacks = this.callbacks.filter(item => item === cb);
    this.callbacks = callbacks;
    return this;
  }
}
