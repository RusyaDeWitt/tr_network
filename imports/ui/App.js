import React from "react";
import { Meteor } from 'meteor/meteor';

import AdminTelegram from './Admin/Telegram/index';
import AdminEachTg from './Admin/Telegram/Each';

import Login from './Auth';

import Home from './Home';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Router>
        {Meteor.userId() ?
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/test" component={Home}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/telegram/" component={AdminTelegram}/>
            <Route exact path="/telegram/:id" component={AdminEachTg}/>
            <Route exact path="*" component={Home}/>
          </Switch>:
          <Route exact path="*" component={Login}/>
        }
      </Router>
    </div>
  );
}
