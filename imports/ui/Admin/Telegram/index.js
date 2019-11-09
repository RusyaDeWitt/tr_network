import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';
import { Redirect } from "react-router-dom";
import { Template } from 'meteor/templating';
import { Telegrams } from '../../../api/telegrams.js';
import AccountsUIWrapper from '../../AccountsUIWrapper.js';

// Telegram component - represents the whole app
class Telegram extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      filtered: null,
    };
  }

  logout() {
    window.location.reload();
    Meteor.logout();
    window.location.reload();
  }

  search(e) {
    let currentList = [];
    let newList = [];

    if (e.target.value !== "") {
      currentList = this.props.telegrams.map((tg) => tg._id + " " + tg.chatid + " " + tg.username + " " + tg.status);
      newList = currentList.filter(item => {
        const lc = item.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      newList = this.props.items;
    }
    this.setState({
      filtered: newList
    });
  }

  remove(id, chatid) {
    Meteor.call('telegrams.remove', id, chatid);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const chatid = ReactDOM.findDOMNode(this.refs.chatid).value.trim();

    Meteor.call('telegrams.insert', chatid);

    // Clear form
    ReactDOM.findDOMNode(this.refs.chatid).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTelegrams() {
    let filteredTelegrams = this.props.telegrams;
    if (this.state.hideCompleted) {
      filteredTelegrams = filteredTelegrams.filter(telegram => !telegram.checked);
    }
    return filteredTelegrams.map((telegram) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const search = telegram._id + " " + telegram.chatid + " " + telegram.username + " " + telegram.status;
      const statuscolor = classnames({
        bluetext: telegram.status == "admin",
        textline: telegram.status == "blocked",
      });
      if(this.state.filtered == null || this.state.filtered.includes(search)){
        return (
          <div className="list width100" key={telegram._id}>
            <p className="text">
              <span>
                <strong className="redtext text-left" onClick={() => this.remove(telegram._id, telegram.chatid)}>[Удалить]</strong>
                {" "}
                <strong className={statuscolor}>{telegram.chatid}</strong> <span>({telegram.username})</span>
                {" "}
                <strong className="greentext text-right" onClick={() => window.location.href=("/telegram/" + telegram._id)}>[Просмотр]</strong>
              </span>
            </p>
          </div>
        );
      }
    });
  }

  render() {
    const adminlist = this.props.adminlist.map((a) => a.chatid);
    return (
      <div className="container">
      {!this.props.currentUser ? "" :
        <div>
        {adminlist.includes(this.props.currentUser.username) ?
          <div>
            <header>
              <center>
                <h1 className="zeromargin">Chat Manager ({this.props.incompleteCount})</h1>
                <p className="zeromargin">
                  {this.props.currentUser.username}{" "}
                  <span className="redtext" onClick={() => this.logout()}>
                    [выйти с аккаунта]
                  </span>
                </p>
                <div className="width50">
                  <form className="width60 left">
                    <input
                      className="form width100 leftcorner"
                      type="text"
                      ref="chatid"
                      placeholder="Chat ID"
                    />
                  </form>
                  <button className="form width40 greenbg whitetext rightcorner" onClick={this.handleSubmit.bind(this)}>
                    Submit
                  </button>
                </div>
              </center>
            </header>
            <center>
              {this.props.telegrams == "" ?
                <div className=" width50 grayborder-full">
                  <h1>Список пуст</h1>
                </div>:
                <div>
                  <div className="width50 grayborder">
                    <input type="text" className="form grayborder-full zeromargin width100" onChange={this.search.bind(this)} placeholder="Найти..." />
                  </div>
                  <div className="width50 grayborder">
                    {this.renderTelegrams()}
                  </div>
                </div>
              }
            </center>
          </div>:""
        }
        </div>}
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('telegrams');

  return {
    telegrams: Telegrams.find({}, { sort: { status: 1, createdAt: -1 } }).fetch(),
    incompleteCount: Telegrams.find({ checked: { $ne: true } }).count(),
    adminlist: Telegrams.find({ status: "admin" }, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(Telegram);
