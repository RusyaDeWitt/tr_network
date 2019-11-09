import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from "react-router-dom";
import { Telegrams } from '../../api/telegrams';
import { Bert } from 'meteor/themeteorchef:bert';
import classnames from 'classnames';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errormsg: "",
      attempt: 1,
      username: "",
      password: "",
      option: 0,
      code: "justapassword",
    };
  }

  username(event) {
    var text = event;
    if (text.match(/^[0-9\-]+$/) || text == ""){
      this.setState({username: text})
      this.setState({errormsg: ""})
    }
  }

  password(event) {
    var text = event;
    if (text.match(/^[0-9\-]+$/) || text == ""){
      this.setState({password: text})
    }
  }

  login(event) {
    event.preventDefault();
    var username = this.state.username;
    var password = this.state.password;
    if(this.state.option){
      Accounts.createUser({username: username, password: password}, (error) => {
        if(error){
          if (error.error == "400") {
            var warn = "Заполните все поля!"
            Bert.alert(warn, 'danger');
            this.setState({errormsg: "Ошибка: " + warn})
          }
          else if (error.error == "403") {
            var warn = "Имя пользователя занято!"
            Bert.alert(warn, 'danger');
            this.setState({errormsg: "Ошибка: " + warn})
          }
          else{
            Bert.alert(error)
          }
        }
        else {
          window.location.reload()
        }
      });
    }
    else{
      Meteor.loginWithPassword(username, password, (error) => {
        if(error){
          if (error.error == "400") {
            var warn = "Заполните все поля!"
            Bert.alert(warn, 'danger');
            this.setState({errormsg: "Ошибка: " + warn})
          }
          else if (error.error == "403") {
            var warn = "Данные введены не верно!"
            Bert.alert(warn, 'danger');
            this.setState({errormsg: "Ошибка: " + warn})
          }
          else {
            Bert.alert(error, 'danger');
            this.setState({errormsg: "Ошибка: " + error})
          }
        }
        else {
          window.location.reload()
        }
      })
    }
  }

  render() {
    return (
      <div className="container">
        {!Meteor.userId() ?
          <center>
            <h1 className="authtext">Для того чтобы воспользоваться данным сайтом, необходимо авторизоваться.</h1>
            <div className="width100 zeromargin">
              <div className="form authform upcorner zeromargin">
                <button onClick={() => this.setState({option: 0})} className="form width50 leftcorner zeromargin">
                  AUTH
                </button>
                <button onClick={() => this.setState({option: 1})} className="form width50 rightcorner zeromargin">
                  REGISTER
                </button>
              </div>
            </div>
            <div className="width100 zeromargin">
              <div className="form authform downcorner zeromargin">
                <div>
                  <form onSubmit={(event) => this.login(event)}>
                    <h2 className="zeromargin left">
                    {this.state.option == 0 ? "AUTH" : "REGISTER"}
                    </h2>
                    <input
                      className="form width100"
                      type="text"
                      value={this.state.username}
                      onChange={event => this.username(event.target.value)}
                      onSubmit={(event) => this.login(event)}
                      placeholder="Username"
                    />
                    <input
                      className="form width100"
                      type="text"
                      value={this.state.password}
                      onChange={event => this.password(event.target.value)}
                      maxLength="10"
                      placeholder="Password"
                    />
                    {this.state.errormsg != ""?
                      <span className="redtext">
                        {this.state.errormsg}
                      </span>:""
                    }
                    <button className="form width100 greenbg whitetext" onClick={(event) => this.login(event)}>
                      {this.state.option == 0 ? "Вход" : "Регистрация"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </center>:
          <Redirect to="/test"/>
        }
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('telegrams');
  return {
    telegrams: Telegrams.find({}, { sort: { status: 1, createdAt: -1 } }).fetch(),
  };
})(Login);
