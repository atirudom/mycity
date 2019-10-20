import React, { Component } from 'react';
import IndexPage from './pages/index'
import CreateMarkerPage from './pages/createMarker'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends Component {
  componentDidMount() {
    document.title = "My City"
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={IndexPage} />
          <Route exact path="/create" component={CreateMarkerPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
