import React from "react";
import Component from "component";
import Todo$ from "todo-store";
import Store from "store";
import classNames from "classnames";
import TodoTextInput from "todo-text-input-component";

const TodoItem$ = new Store({
  isEditing: false
});

TodoItem$.action("EDITING", () => { isEditing: true });
TodoItem$.action("NOT_EDITING", () => { isEditing: false });

const TodoItem = new Component();

TodoItem.addStore(Todo$, (state, props) => {
  return state[props.id];
});

TodoItem.addStore(TodoItem$);

TodoItem.on("render", state => (
  <li
    className={classNames({
      completed: state.completed,
      editing: state.isEditing
    })}
  >
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={state.completed}
        onChange={TodoItem.generate("change")}
      />
      <label onDoubleClick={TodoItem.generate("double_click")}>
        {state.text}
      </label>
      <button className="destroy" onClick={TodoItem.generate("click")} />
    </div>
    {state.isEditing && (
      <TodoTextInput
        className="edit"
        onSave={TodoItem.generate("save")}
        value={state.text}
      />
    )}
  </li>
));

TodoItem.on("change", (state, props) =>
  TodoStore$.trigger("TOGGLE_COMPLETE", props.id)
);
TodoItem.on("double_click", () => TodoItem$.trigger("EDITING"));
TodoItem.on("click", (state, props) => Todo$.trigger("DESTROY", props.id));
TodoItem.on("save", (state, props, text) =>
  Todo$.trigger("UPDATE", props.id, text)
  TodoItem$.trigger("NOT_EDITING");
);

export default TodoItem.export();
