import React from "react";
import Component from "component";
import TodoItem from "todo-item-component";
import TodoStore$ from "todo-store";

const MainSection = new Component();

MainSection.addStore(TodoStore$, TodoStore$.getFilter("ARE_ALL_COMPLETE"));

MainSection.on("render", (state, props) => (
	<section id="main">
		<input id="toggle-all"
			type="checkbox"
			onChange={MainSection.generate("CHANGE")}
			checked={state.areAllComplete} />
		<label htmlFor="toggle-all">Mark all as complete</label>
		<ul id="todo-list">
			{MainSection.triggerFirst("renderTodos")}
		</ul>
	</section>
));

MainSection.on("renderTodos", (state, props) => 
	Object.keys(state).map((key) => <TodoItem key={key} id={key} />)
);

MainSection.on("CHANGE", () => { TodoStore$.triggerAction("TOGGLE_COMPLETE_ALL"); })
