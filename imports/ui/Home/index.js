import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';
import { Redirect } from "react-router-dom";
import moment from 'moment';
import { Bert } from 'meteor/themeteorchef:bert';
import { Telegrams } from '../../api/telegrams.js';
import AccountsUIWrapper from '../AccountsUIWrapper.js';

// Telegram component - represents the whole app
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
      filtered: null,
      selected: 1,
    };
  }

  logout(event) {
    event.preventDefault();
    Meteor.logout()
    window.location.reload()
  }

  render() {
    return (
      <div className="container">
        {this.props.user ?
          <div>
            <div>
              <h1 onClick={(event) => this.logout(event)}>{"{Logout}"}</h1>
            </div>
          </div>:""
        }
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('telegrams');

  return {
    telegrams: Telegrams.find({ status: { $ne: 'blocked' } }, { sort: { createdAt: -1 } }).fetch(),
    user: Meteor.user(),
  };
})(Homepage);
