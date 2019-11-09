import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';
import { Telegrams } from '../../../api/telegrams.js';
import AccountsUIWrapper from '../../AccountsUIWrapper.js';

class EachTelegram extends Component {

  remove(id) {
    Meteor.call('telegrams.remove', id);
  }

  setstatus(event, chatid) {
    const status = event.target.value;
    Meteor.call('telegrams.setstatus', chatid, status, false);
  }

  sendMessage(event, chatid) {
    event.preventDefault();
    var message = ReactDOM.findDOMNode(this.refs.message).value.trim();
    message += "\n\nСообщение от: #" + this.props.user.username;
    Meteor.call('telegrams.sendMessage', chatid, message);
    ReactDOM.findDOMNode(this.refs.message).value = '';
  }

  setusername(event, chatid) {
    event.preventDefault();
    const username = ReactDOM.findDOMNode(this.refs.username).value.trim();
    Meteor.call('telegrams.setusername', chatid, username);
    ReactDOM.findDOMNode(this.refs.username).value = '';
  }

  renderTelegrams() {
    const { params } = this.props.match;
    let filteredTelegrams = this.props.telegrams;
    return filteredTelegrams.map((telegram) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = telegram.owner === currentUserId;
      if(params.id == telegram._id){
        return (
          <div key={telegram._id}>
            <center>
              <h1>{telegram.chatid}</h1>
            </center>
            <hr />
            <div className="flexdis mobileunflex">
              <div className="form leftcorner width50 mobileunflex mobile100">
                <p className="each-p zeromargin">Статус: {telegram.status}</p>
                <p className="each-p zeromargin">Telegram ID: #{telegram.chatid}</p>
                <p className="each-p zeromargin">Имя пользователя: *{telegram.username}</p>
              </div>
              <div className="form rightcorner width50 mobileunflex mobile100">
                <form onSubmit={(event) => this.setstatus(event, telegram.chatid)}>
                  <span className="each-p">Изменить статус: </span>
                  <select className="form-small each-p" defaultValue={telegram.status} onChange={(event) => this.setstatus(event, telegram.chatid)}>
                    <option>blocked</option>
                    <option>user</option>
                    <option>admin</option>
                  </select>
                </form>
                <form onSubmit={(event) => this.setusername(event, telegram.chatid)}>
                  <span className="each-p">Имя пользователя: </span>
                  <input
                    className="form-small each-p"
                    type="text"
                    ref="username"
                  />
                </form>
                <form onSubmit={(event) => this.sendMessage(event, telegram.chatid)}>
                  <span className="each-p">Отправить сообщение: </span>
                  <input
                    className="form-small each-p"
                    type="text"
                    ref="message"
                  />
                </form>
              </div>
            </div>
          </div>
        );
      }
    });
  }

  render() {
    const { params } = this.props.match;
    return (
      <div className="container">
        {this.props.user ?
          <div>
            {this.renderTelegrams()}
          </div>:""
        }
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('telegrams');

  return {
    telegrams: Telegrams.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Telegrams.find({ checked: { $ne: true } }).count(),
    user: Meteor.user(),
  };
})(EachTelegram);
