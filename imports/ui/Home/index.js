import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';
import { Redirect } from "react-router-dom";
import moment from 'moment';
import { Bert } from 'meteor/themeteorchef:bert';
import { Telegrams } from '../../api/telegrams.js';
import { Informations } from '../../api/informations.js';
import AccountsUIWrapper from '../AccountsUIWrapper.js';

// Telegram component - represents the whole app
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
      filtered: null,
      selected: 1,
      chat: "",
      send: 0,
    };
  }

  logout(event) {
    event.preventDefault();
    window.location.reload()
    Meteor.logout()
    window.location.reload()
  }

  renderInfo(username) {
    let filteredInfos = this.props.informations;
    return filteredInfos.map((info) => {
      if(username == info.username){
        var userchats = [];
        return (
          <div key={info._id}>
            <center>
              <div className="form width60 zeromargin upcorner">
                <h2 className="zeromargin">Имя пользователя: {info.username}</h2>
                <h2 className="zeromargin">{info.surname} {info.name}</h2>
                <span onClick={(event) => this.logout(event)} className="redtext zeromargin">
                  [выйти из аккаунта]
                </span>
              </div>
              <div className="form width60 zeromargin downcorner">
                <div className="width100">
                  <h2 className="width100 left">
                    {this.state.chat == "" ?
                    <div>
                      {info.messages.length >= 1 ?
                      <div>
                        <div className="left width30">
                        </div>
                        <div className="width40">
                          <span>Чаты:</span>
                        </div>
                        <div className="right width30">
                        </div>
                      </div>:
                      <div>
                        {!this.state.send ?
                        <div>
                          <div className="left width30">
                          </div>
                          <div className="width40">
                            <span>
                              Вы еще не получали/отправляли сообщения
                            </span>
                            <br />
                            <h5 onClick={() => this.setState({send: 1})} className="zeromargin from">
                              [отправить сейчас]
                            </h5>
                          </div>
                          <div className="right width30">
                          </div>
                        </div>:
                        <div>
                          <h4 className="zeromargin">Отправить сообщение</h4>
                          <div className="width40">
                            <input
                              type="text"
                              className="form width50 leftcorner"
                              placeholder="username"
                            />
                            <input
                              type="text"
                              className="form width50 rightcorner"
                              placeholder="text"
                            />
                          </div>
                        </div>}
                      </div>}
                    </div>
                    :
                    <div className="from">
                      <div className="left width30">
                        <span onClick={() => this.setState({chat: ""})}>
                          ⟸
                        </span>
                      </div>
                      <div className="width40">
                        <span>{this.state.chat}</span>
                      </div>
                      <div className="right width30">
                      </div>
                    </div>}
                  </h2>
                </div>
                {this.state.chat == "" ?
                <div className="all">
                  <br />
                  {info.messages.length >= 1 ?
                    <hr />:""
                  }
                  {info.messages.map((msg) => {
                    var key = msg + Math.floor(Math.random() * 100);
                    var start = msg.indexOf("[")
                    var end = msg.indexOf("]")
                    var from = msg.substring(start+1, end)
                    if(!userchats.includes(from)){
                      userchats.push(from)
                      return (
                        <div key={key} className="list width100">
                          <p onClick={() => this.setState({chat: from})}>{from}</p>
                        </div>
                      )
                    }
                  })}
                </div>:
                <div className="all">
                  <br />
                  <hr />
                  {info.messages.map((msg) => {
                    var key = msg + Math.floor(Math.random() * 100);
                    var from = "[" + this.state.chat + "] =>";
                    var to = "[" + this.state.chat + "] <=";
                    if(msg.includes(from)){
                      var text = msg.split(from);
                      var message = text[1]
                      return (
                        <div key={key} className="list width100 from">
                          <p>{this.state.chat}: {message}</p>
                        </div>
                      )
                    }
                    else if(msg.includes(to)){
                      var text = msg.split(to);
                      var message = text[1]
                      return (
                        <div key={key} className="list width100 to">
                          <p>{info.username}: {message}</p>
                        </div>
                      )
                    }
                  })}
                  <form>
                    <input
                      type="text"
                      className="form width100 zeromargin nocorner"
                    />
                  </form>
                </div>}
              </div>
            </center>
          </div>
        );
      }
    });
  }

  render() {
    return (
      <div className="container">
        {this.props.user ?
          <div>
            <div>
              {this.renderInfo(this.props.user.username)}
            </div>
          </div>:""
        }
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('telegrams');
  Meteor.subscribe('informations');
  return {
    user: Meteor.user(),
    telegrams: Telegrams.find({}, { sort: { status: 1, createdAt: -1 } }).fetch(),
    informations: Informations.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
})(Homepage);
