import React from "react";
import Component from "component";
import TodoStore$ from "todo-store";
import Store from "store";
import classNames from "classnames";
import TodoTextInput from "todo-text-input-component";

const TodoItemStore$ = new Store({
  isEditing: false
});

TodoItemStore$.action("EDITING", { isEditing: true });
TodoItemStore$.action("NOT_EDITING", { isEditing: false });

const TodoItem = new Component();

TodoItem.addStore(TodoStore$, (state, props) => {
  return state[props.id];
});

TodoItem.addStore(TodoItemStore$);

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
        onChange={TodoItem.generate("CHANGE")}
      />
      <label onDoubleClick={TodoItem.generate("DOUBLE_CLICK")}>
        {state.text}
      </label>
      <button className="destroy" onClick={TodoItem.generate("CLICK")} />
    </div>
    {state.isEditing && (
      <TodoTextInput
        className="edit"
        onSave={TodoItem.generate("SAVE")}
        value={state.text}
      />
    )}
  </li>
));

TodoItem.on("CHANGE", (state, props) =>
  TodoStore$.trigger("TOGGLE_COMPLETE", props.id)
);
TodoItem.on("DOUBLE_CLICK", () => TodoItemStore$.trigger("EDITING"));
TodoItem.on("CLICK", (state, props) => TodoStore$.trigger("DESTROY", props.id));
TodoItem.on("SAVE", (state, props, text) =>
  TodoStore$.trigger("UPDATE", props.id, text)
);

export default TodoItem.export();
