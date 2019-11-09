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
      username: "",
      msgtext: "",
      error: "",
      chat: "",
      send: 0,
    };
  }

  username(event) {
    var text = event;
    this.setState({username: text})
  }

  msgtext(event) {
    var text = event;
    this.setState({msgtext: text})
  }

  sendfirstmsg(event) {
    event.preventDefault();
    var username = this.state.username;
    var msgtext = this.state.msgtext;
    var usernamelist = Informations.find().map((profile) => profile.username);
    if(!usernamelist.includes(username)){
      var warn = "Пользователь не найден!"
      Bert.alert(warn, 'danger')
      this.setState({ error: "Ошибка: " + warn })
    }
    else {
      Meteor.call('informations.sendmessage', this.props.user.username.toString(), username.toString(), msgtext.toString())
      this.setState({ username: "" })
      this.setState({ msgtext: "" })
    }
  }

  send(event) {
    event.preventDefault();
    var username = this.state.chat;
    var msgtext = this.state.msgtext;
    var usernamelist = Informations.find().map((profile) => profile.username);
    if(!usernamelist.includes(username)){
      var warn = "Пользователь не найден!"
      Bert.alert(warn, 'danger')
      this.setState({ error: "Ошибка: " + warn })
    }
    else {
      Meteor.call('informations.sendmessage', this.props.user.username.toString(), username.toString(), msgtext.toString())
      this.setState({ msgtext: "" })
    }
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
                <h2 className="profile-full-name">{info.surname} {info.name}</h2>

                <div className="width100">
                  <h2 className="width100 left">
                    {this.state.chat == "" ?
                    <div>
                      {info.messages.length >= 1 ?
                      <div>
                        <div className="left width30 margin10px">
                        </div>
                        <div className="width40">
                          <input
                            type="text"
                            className="form width40 nocorner margin10px"
                            value={this.state.username}
                            onChange={event => this.username(event.target.value)}
                            placeholder="Имя пользователя"
                          />
                          <input
                            type="text"
                            className="form width40 nocorner margin10px"
                            value={this.state.msgtext}
                            onChange={event => this.msgtext(event.target.value)}
                            placeholder="Текст сообщения"
                          />
                          <button onClick={(event) => this.sendfirstmsg(event)} className="form width20 nocorner greenbg whitetext">
                            Отправить
                          </button>
                        </div>

                        <div className="left width30">
                        <span className="chat-h">Чаты:</span>
                        </div>
                      </div>:
                      <div>
                        {!this.state.send ?
                        <div>
                          <div className="left width30">
                          </div>
                          <div className="width40">
                            <span>
                              У вас пока нет диалогов
                            </span>
                            <br />
                            <h5 onClick={() => this.setState({send: 1})} className="zeromargin from">
                              Написать
                            </h5>
                          </div>
                          <div className="right width30">
                          </div>
                        </div>:
                        <div>
                          <div className="width50 form">
                            <h4 className="zeromargin">Отправить сообщение</h4>
                            <input
                              type="text"
                              className="form width50 leftcorner"
                              value={this.state.username}
                              onChange={event => this.username(event.target.value)}
                              placeholder="Имя пользователя"
                            />
                            <input
                              type="text"
                              className="form width50 rightcorner"
                              value={this.state.msgtext}
                              onChange={event => this.msgtext(event.target.value)}
                              placeholder="Текст сообщения"
                            />
                            {this.state.error != "" ?
                              <h6 className="zeromargin redtext">{this.state.error}</h6>:""
                            }
                            <button onClick={(event) => this.sendfirstmsg(event)} className="form width100 greenbg whitetext">
                              Отправить
                            </button>
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
                  {info.messages.map((msg) => {
                    var key = msg + Math.floor(Math.random() * 100);
                    var start = msg.indexOf("[")
                    var end = msg.indexOf("]")
                    var from = msg.substring(start+1, end)
                    if(!userchats.includes(from)){
                      userchats.push(from)
                      var profile = Informations.findOne({username: from});
                      return (
                        <div key={key} className="list width70">
                          <ul onClick={() => this.setState({chat: from})}>
                             {profile.surname} {profile.name}
                          </ul>
                        </div>
                      )
                    }
                  })}
                  {this.state.error != "" ?
                    <h4 className="zeromargin redtext">{this.state.error}</h4>:""
                  }
                </div>:
                <div className="all">
                  {info.messages.map((msg) => {
                    var key = msg + Math.floor(Math.random() * 100);
                    var from = "[" + this.state.chat + "] =>";
                    var to = "[" + this.state.chat + "] <=";
                    if(msg.includes(from)){
                      var text = msg.split(from);
                      var message = text[1]
                      var profile = Informations.findOne({username: this.state.chat});
                      return (
                        <div key={key} className="list width100 from">
                          <p className="message-text">{profile.surname} {profile.name}: {message}</p>
                        </div>
                      )
                    }
                    else if(msg.includes(to)){
                      var text = msg.split(to);
                      var message = text[1]
                      var profile = Informations.findOne({username: username});
                      return (
                        <div key={key} className="list width100 to">
                          <p className="message-text">{profile.surname} {profile.name}: {message}</p>
                        </div>
                      )
                    }
                  })}
                  <form>
                    <input
                      type="text"
                      className="form width50 zeromargin nocorner"
                      value={this.state.msgtext}
                      onChange={event => this.msgtext(event.target.value)}
                      placeholder="Текст сообщения"
                    />
                    <button onClick={(event) => this.send(event)} className="form width30 greenbg whitetext zeromargin nocorner">
                      Отправить
                    </button>
                  </form>
                </div>}
            </center>
          </div>
        );
      }
    });
  }

  render() {
    return (
      <div className="container">
      <header className="main-page-h">
        <h1 className="main-page-h1">TR
        <span onClick={(event) => this.logout(event)} className="main-page-span">
          Выйти
        </span>
        </h1>
      </header>

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
