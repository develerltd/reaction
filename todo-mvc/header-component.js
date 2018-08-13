import Component from "component";
import Todo$ from "todo-store";
import TodoTextInput from "todo-text-input-component";

const Header = new Component();

Header.on("render", state => (
  <header id="header">
    <h1> todos </h1>
    <TodoTextInput
      id="new-todo"
      placeholder=" What needs to be done? "
      onSave={Header.generate("save")}
      value=""
    />
  </header>
));

Header.on("save", (state, props, text) => {
  Todo$.triggerAction("CREATE", text);
});

export default Header.export();
