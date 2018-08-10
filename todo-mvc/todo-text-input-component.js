import React from "react";
import Component from "component";
import Store from "store";

const ENTER_KEY_CODE = 13;

const InputStore$ = new Store({
  text: ""
});

InputStore$.action("UPDATE", (state, text) => {
  text;
});

const TodoTextInput = new Component();

TodoTextInput.on("constructor", (state, props) => {
  InputStore$.trigger("UPDATE", props.value);
});

TodoTextInput.on("render", (state, props) => (
  <input
    type="text"
    id={props.id}
    placeholder={props.placeholder}
    onChange={TodoTextInput.generate("CHANGE")}
    onBlur={TodoTextInput.generate("SAVE")}
    onKeyDown={TodoTextInput.generate("KEY_DOWN")}
    value={state.text}
    autoFocus={true}
    className={props.className}
  />
));

TodoTextInput.on("CHANGE", (state, props, e) =>
  InputStore$.action("UPDATE", e.target.value)
);

TodoTextInput.on("KEY_DOWN", (state, props, e) => {
  if (e.keyCode === ENTER_KEY_CODE) {
    TodoTextInput.trigger("SAVE");
  }
});

TodoTextInput.on("SAVE", (state, props) => {
  props.onSave(state.text);
  InputStore$.action("UPDATE", "");
});
