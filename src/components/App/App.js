import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './App.css';
import Game from "../Game/Game";
import Menu from "../Menu/Menu";
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import appReducers from "../../reducers";

const store = createStore(appReducers);

class App extends Component {
  render() {
    return (
        <Router>
            <Provider store={store}>
            <Switch>
            <Route exact path="/" component={Menu}/>
            <Route  path="/Game" component={Game} />
            </Switch>
            </Provider>
        </Router>
    );
  }
}

export default App;
