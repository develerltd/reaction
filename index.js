// Create a store
const Names$ = new Store({
  name: "Initial"
// id: null
// error: null
});


// Define reducers
Names$.action("CLICKED", (state, name) => ({ ...state, name }));

/*
Names$.action("UPDATED", (state, {id}) => ({ ...state, id }))
Names$.action("ERROR", (state, error) => ({ ...state, error}))

// Define side-effects

Names$.on("CLICKED", async (state, triggerAction, name) => {
  try {
    const response = await fetch("/api/call");
    triggerAction("UPDATED", response);
  } catch (e) {
    triggerAction("ERROR", e);
  }
});
*/

// Create new component
const ev = new Component();

// Connect a store
ev.addStore(Names$);
// ev.addStore(Names$, (state) => {name}); // with Mapper

ev.on("render", function(state, props) {
  return (
    <div>
      <h1>Foos {state.name}</h1>
      <button type="button" onClick={ev.generate("click")}>
        Click Me
      </button>
    </div>
  );
});

ev.on("click", () => Names$.triggerAction("CLICKED", "New"));

function App() {
  const Ev = ev.export();
  return <Ev />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
