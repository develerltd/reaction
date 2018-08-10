import React from "react";

export default class Component {
  constructor(props) {
    const current = this;
    this.instance = class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
        current.currentInstance = this;
        current.trigger("constructor");
      }

      componentWillMount() {
        current.trigger("willmount");
      }

      componentDidMount() {
        current.trigger("didmount");
      }

      componentWillUnmount() {
        current.trigger("willunmount");
      }

      render() {
        return current.triggerFirst("render");
      }
    };

    this.events = {};
    this.generatedEvents = {};
    this.actions = {};
    this.addStore = this.addStore.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.trigger = this.trigger.bind(this);
    this.generate = this.generate.bind(this);
    this.export = this.export.bind(this);
  }

  addStore(store, mapper) {
    let connected;
    const current = this;

    if (typeof mapper === "function") {
      connected = (newState) => {
        current.currentInstance.setState(mapper(newState, current.currentInstance.props));
      };        
    } else if (typeof mapper === "object" && mapper.type === "filter") {
      connected = (newState) => {
        const mapper = store.filters[mapper.name];
        current.currentInstance.setState(mapper(newState, current.currentInstance.props, ...mapper.args));
      };
    } else {
      connected = (newState) => {
        current.currentInstance.setState(newState);
      };
    }

    this.on("willmount", () => {
      store.connect(connected);
    });
    this.on("willunmount", () => {
      store.disconnect(connected);
    });

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

  generate(event, ...args) {
    if (!this.generatedEvents.hasOwnProperty(event)) {
      this.generatedEvents[event] = (...all) => {
        this.trigger(event, ...args, ...all);
      };
    }

    return this.generatedEvents[event];
  }

  trigger(event, ...args) {
    const currentInstance = this.currentInstance;
    if (this.events.hasOwnProperty(event)) {
      return this.events[event].map(cb => {
        return cb(currentInstance.state, currentInstance.props, ...args);
      });
    }
  }

  triggerFirst(event, ...args) {
    const currentInstance = this.currentInstance;
    if (this.events.hasOwnProperty(event)) {
      const cb = this.events[event][0];
      return cb(currentInstance.state, currentInstance.props, ...args);
    }    
  }

  export() {
    return this.instance;
  }
}
