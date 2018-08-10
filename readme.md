"Reaction" an event style wrapper for react / flux components.

This repo is just a basic idea I had before (no clue whether its of any use or not) to be able to present the lifecycle components and other events of a react component in an "on", "off" style, coupled with a basic
store that can handle actions and side-effects.

# Example 1

This example is based on the example from https://github.com/jsiwhitehead/refluent where we create a component which renders a text field, with optional initial label and hoverable submit button, which will only call the parent submit function (whatever that may be) if the value is below 100 characters.

```
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