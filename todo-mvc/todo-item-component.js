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
TodoItem.on("double_click", () => TodoItemStore$.trigger("EDITING"));
TodoItem.on("click", (state, props) => TodoStore$.trigger("DESTROY", props.id));
TodoItem.on("save", (state, props, text) =>
  TodoStore$.trigger("UPDATE", props.id, text)
  TodoItemStore$.trigger("NOT_EDITING");
);

export default TodoItem.export();
