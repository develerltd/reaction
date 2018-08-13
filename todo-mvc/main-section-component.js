import React from "react";
import Component from "component";
import TodoItem from "todo-item-component";
import Todo$ from "todo-store";

const MainSection = new Component();

MainSection.addStore(Todo$, Todo$.getFilter("ARE_ALL_COMPLETE"));

MainSection.on("render", (state, props) => (
  <section id="main">
    <input
      id="toggle-all"
      type="checkbox"
      onChange={MainSection.generate("change")}
      checked={state.areAllComplete}
    />
    <label htmlFor="toggle-all">Mark all as complete</label>
    <ul id="todo-list">{MainSection.triggerFirst("render_todos")}</ul>
  </section>
));

MainSection.on("render_todos", (state, props) =>
  Object.keys(state).map(key => <TodoItem key={key} id={key} />)
);

MainSection.on("change", () => {
  Todo$.triggerAction("TOGGLE_COMPLETE_ALL");
});
