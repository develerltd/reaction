import Store from "store";

function isComplete(state) {
  return Object.keys(state).every(key => state[key].complete);
}

const Todo$ = new Store({});

Todo$.filter("ARE_ALL_COMPLETE", state => {
  const areAllComplete = isComplete(state);
  return {
    areAllComplete,
    keys: Object.keys(state)
  };
});

Todo$.filter("STATISTICS", state => {
  const total = Object.keys(state).length;
  const completedTodos = Object.keys(state).filter(key => state[key].complete)
    .length;
  const itemsLeft = total - completedTodos;
  const itemsLeftPhrase = itemsLeft === 1 ? " item left" : " items left";

  return {
    completedTodos,
    itemsLeft,
    itemsLeftPhrase
  };
});

Todo$.action("CREATE", (state, text) => {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  return {
    ...state,
    [id]: {
      id,
      complete: false,
      text
    }
  };
});

Todo$.action("DESTROY", (state, id) => {
  const { [id]: removed, ...newState } = state;

  return newState;
});

Todo$.action("UPDATE", (state, id, feature) => ({
  ...state,
  [id]: {
    ...state[id],
    ...feature
  }
}));

Todo$.on("UPDATE_ALL", (state, trigger, feature) => {
  Object.keys(state).forEach(id => trigger("UPDATE", id, feature));
});

Todo$.on("DESTROY_COMPLETED", (state, trigger) => {
  state
    .filter(item => item.complete)
    .forEach(item => trigger("DESTROY", item.id));
});

Todo$.on("UPDATE_TEXT", (state, trigger, id, text) => {
  trigger("UPDATE", id, { text });
});

Todo$.on("COMPLETE", (state, trigger, id) => {
  trigger("UPDATE", id, { complete: true });
});

Todo$.on("UNDO_COMPLETE", (state, trigger, id) => {
  trigger("UPDATE", id, { complete: true });
});

Todo$.on("TOGGLE_COMPLETE_ALL", (state, trigger) => {
  trigger("UPDATE_ALL", { complete: !isComplete(state) });
});

export default TodoStore$;
