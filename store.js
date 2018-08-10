export default class Store {
  constructor(initialState) {
    this.state = initialState || {};
    this.actions = {};
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

    return this;
  }

  action(action, mutator) {
    this.actions[action] = mutator;
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
