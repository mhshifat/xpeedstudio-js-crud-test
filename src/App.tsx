import { Container } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Create from "./apps/pages/Create";
import DemoDynamicForm from "./apps/pages/DemoDynamicForm";
import List from "./apps/pages/List";
import Update from "./apps/pages/Update";

function App() {
  return (
    <Container>
      <Switch>
        <Route exact path="/" component={List} />
        <Route path="/create" component={Create} />
        <Route path="/update/:id" component={Update} />
        <Route path="/form" component={DemoDynamicForm} />
      </Switch>
    </Container>
  );
}

export default App;
