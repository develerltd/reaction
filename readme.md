"Reaction" an event style wrapper for react / flux components.

This repo is just a basic idea I had before (no clue whether its of any use or not) to be able to present the lifecycle components and other events of a react component in an "on", "off" style, coupled with a basic
store that can handle actions and side-effects.

# Example 1

This example is based on the example from https://github.com/jsiwhitehead/refluent where we create a component which renders a text field, with optional initial label and hoverable submit button, which will only call the parent submit function (whatever that may be) if the value is below 100 characters.

```javascript
import Component from "./component";
import Store from "./store";

const Hover$ = new Store({
  isHovered: false,
  value: ""
});

Hover$.action("HOVER", (state) => ({...state, isHovered: true}));
Hover$.action("UNHOVER", (state) => ({...state, isHovered: false}));
Hover$.action("CHANGE", (state, value) => ({...state, value});

const ShortInput = new Component();

ShortInput.addStore(Hover$);

ShortInput.on("render",(state, props) => (
  <div>
    <input 
      type="text" 
      value={state.value} 
      onChange={ShortInput.generate("change")} 
      onKeyDown={ShortInput.generate("keydown")} />
    <p 
      onClick={ShortInput.generate("submit")} 
      onMouseMove={ShortInput.generate("enter")}
      onMouseLeave={ShortInput.generate("leave")}
      style={{background: state.isHovered?'red':'orange'}}>
      Submit
    </p>
  </div>
));

ShortInput.on("change", (state, props, e) => Hover$.action("CHANGE", e.target.value));

ShortInput.on("keydown", (state, props, e) => {
  if (e.keyCode === 13) {
    ShortInput.trigger("submit");
  }
});

ShortInput.on("submit", (state, props) => {
  if (state.value.length < 100) {
    props.submit();
  }
});

ShortInput.on("enter", () => Hover$.action("HOVER"));
ShortInput.on("leave", () => Hover$.action("UNHOVER"));

export default ShortInput.export();
```

# Example 2

Example 2 is in the todomvc folder, and is a reworked version of https://github.com/vidyuthd/es6-react-todo

# Coding conventions

Though of course this is entirely up to you, the following coding conventions are recommended for usage:

1) All store components are named in singular without the word "Store" and suffixed with a $.

2) All store actions are upper snake cased (eg SET_COMPLETE).

3) All generated component events are lower snake cased (eg double_click).

4) No mapping is performed in the render function. The render function where possible should just be a pure JSX render tree. All mappings are placed into the addStore mappers.

5) Components never use setState. All state settings are handled by attaching stores to a component. Either global ones or local ones (that can be either created in the same file).

6) Where possible if store's data needs to be mapped, create the mapper as a filter inside the store, and give it a meaningful name, rather than using a function in the component that needs the mapping.

# API

## Store

### Instantiate

```javascript
const Store$ = new Store({initialState});
```

This creates a new store, with the initial state set to whatever you pass in.

### Action

```javascript
Store$.action("INIT", (oldState, ...args) => ({...oldState, ...args}));
```

This performs an action which updates the state of the component, fires any listener events and any connected components are updated.

### On

```javascript
Store$.on("UPDATE", (state, trigger, ...args) => {
  const response = await fetch("/api/call");
  trigger("SET", response);
});
```

This performs any function that can result in multiple actions, such as ajax calls or other side effects.

### Filter

```javascript
Store$.filter("JUST_ERRORS", (state, props, ...args) => {
  return {
    state.errors
  }
});

This generates a filter for the store that can be called by the "addStore" function of a component - it receives the current store's state, and the props of the component that it is being added to, as well as any other arguments passed at run-time to "getFilter". It then returns a mapped version of the store's state.

### getFilter

```javascript
Component.addStore(Store$,Store$.getFilter("JUST_ERRORS"));
```

Retrieves the filter specified for mapping the store data to a component. Optionally passes any additional arguments to the filter.

### TriggerAction

```javascript
Store$.triggerAction("INIT", a, b, c);
```

This fires the selected action, or associated "ON" event. The arguments are appended to the action function after the original state variable. The arguments are appended to any listener functions after the currentState, and this function.

### Connect

```javascript
Store$.connect(cb);
```

Calls this callback whenever the store is updated.

### Disconnect
```javascript
Store$.disconnect(cb);
```

Removes the callback from being called (must be the same callback as in connect)

## Component

### addStore

```javascript
Component.addStore(Store$, Store$.filter("NAME"));
```

This function connects a store to a component, optionally mapping the store with either a callback function, or a pre-defined filter. The callback function would receive the store's state and the components props.

The component is "connected" to the store at mount, and "disconnected" at unmount.

Multiple stores can be added by calling addStore more than once. But it is advisable for the mapping not to return the same key for multiple stores to avoid conflicts.

### on

```javascript
Component.on("render", (state, props, ...args) => <div onClick={Component.generate("click")}>Foo</div>);
Component.on("click", (state, props, e) => Store$.action("CLICK"));
```

This function queues up a callback for the specific event. There are some predefined events that map to the react lifecycle, and then you can create custom events using the generate function (see below). The predefined events are:

* constructor - called in constructor
* willmount - called on componentWillMount
* didmount - called on componentDidMount
* willunmount - called on componentWillUnmount
* render - called on render (but only the first added "on" callback is called)

### generate

```javascript
Component.on("render", (state, props, ...args) => <div onClick={Component.generate("click")}>Foo</div>);
Component.on("click", (state, props, e) => Store$.action("CLICK"));
```

This generates a new event (with any additional arguments) and passes through the arguments passed to it. An event must have a unique name, if called with the same name twice, it will re-use the existing event callback generated.

### trigger

```javascript
Component.trigger("click");
Component.on("click", (state, props, e) => Store$.action("CLICK"));
```

Trigger fires an event. And any additional arguments can be passed to it are passed through to the event, after state and props.

### triggerFirst

This fires the first "on" event that was registered for this component's event.

### export

```javascript
export const Component = new Component();
export default Component.export();
```
This returns the actual react component generated by the above code, for use in rendering. If you wish to attach events to this component from other modules, you will need to export the actual Component also, as the react component itself is not aware of the above functionality.
