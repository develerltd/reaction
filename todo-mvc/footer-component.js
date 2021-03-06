import React from "react";
import Component from "component";
import Todo$ from "todo-store";

const Footer = new Component();

Footer.addStore(Todo$, Todo$.getFilter("STATISTICS"));

Footer.on("render", (state, props) => (
  <footer id="footer">
    <span id="todo-count">
      <strong>{state.itemsLeft}</strong>
      {state.itemsLeftPhrase}
    </span>
    {state.completedTodos > 0 && (
      <button id="clear-completed" onClick={Footer.generate("click")}>
        Clear Completed ({state.completedTodos})
      </button>
    )}
  </footer>
));

Footer.on("click", () => {
  Todo$.triggerAction("DESTROY_COMPLETED");
});

export default Footer.export();
