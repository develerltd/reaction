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
    onChange={TodoTextInput.generate("change")}
    onBlur={TodoTextInput.generate("save")}
    onKeyDown={TodoTextInput.generate("key_down")}
    value={state.text}
    autoFocus={true}
    className={props.className}
  />
));

TodoTextInput.on("change", (state, props, e) =>
  InputStore$.action("UPDATE", e.target.value)
);

TodoTextInput.on("key_down", (state, props, e) => {
  if (e.keyCode === ENTER_KEY_CODE) {
    TodoTextInput.trigger("save");
  }
});

TodoTextInput.on("save", (state, props) => {
  props.onSave(state.text);
  InputStore$.action("UPDATE", "");
});
