import React from "react";
import Component from "component";
import Todo$ from "todo-store";
import Header from "header-component";
import MainSection from "main-section-component";
import Footer from "footer-component";

const App = new Component();

App.addStore(Todo$, state => {
  return {
    total: Object.keys(state).length
  };
});

App.on("render", state => (
  <div>
    <Header />
    {state.total > 0 && <MainSection />}
    <Footer />
  </div>
));

export default App.export();
