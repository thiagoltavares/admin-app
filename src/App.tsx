import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import DashboardTemplate from "./containers/templates/Dashboard";
import 'sweetalert2/dist/sweetalert2.css'

const Root = () => <h1>Hello World</h1>

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Root} />
        <Route path="/dashboard" component={DashboardTemplate} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
