import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from "react-router-dom";
import { Informations } from '../../api/informations';
import { Telegrams } from '../../api/telegrams';
import { Bert } from 'meteor/themeteorchef:bert';
import classnames from 'classnames';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      option: 0,
      errormsg: "",
      username: "",
      password: "",
      surname: "",
      name: "",
    };
  }

  surname(event) {
    var text = event;
    if (text.match(/^[a-zA-Z]+$/) || text.match(/^[а-яА-Я]+$/) || text == ""){
      this.setState({surname: text})
    }
  }

  name(event) {
    var text = event;
    if (text.match(/^[a-zA-Z]+$/) || text.match(/^[а-яА-Я]+$/) || text == ""){
      this.setState({name: text})
    }
  }

  username(event) {
    var text = event;
    if (text.match(/^[0-9\-]+$/) || text.match(/^[a-zA-Z]+$/) || text.match(/^[а-яА-Я]+$/) || text == ""){
      this.setState({username: text})
      this.setState({errormsg: ""})
    }
  }

  password(event) {
    var text = event;
    if (text.match(/^[0-9\-]+$/) || text.match(/^[a-zA-Z]+$/) || text.match(/^[а-яА-Я]+$/) || text == ""){
      this.setState({password: text})
    }
  }

  login(event) {
    event.preventDefault();
    var username = this.state.username;
    var password = this.state.password;
    var surname = this.state.surname;
    var name = this.state.name;
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
          Meteor.call('informations.insert', username.toString(), password.toString(), surname, name);
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

        <header className="main-page-h">
          <h1 className="main-page-h1">TR</h1>
        </header>


      <div className="main-body">
        <div className="registration-form ">
        {!Meteor.userId() ?
          <center>
            <h1 className="authtext">Добро пожаловать!</h1>
            <div className="width100 zeromargin">
              <div className="form authform upcorner zeromargin">
                <button onClick={() => this.setState({option: 0})} className="form width50 leftcorner zeromargin">
                  Войти
                </button>
                <button onClick={() => this.setState({option: 1})} className="form width50 rightcorner zeromargin">
                  Зарегистрироваться
                </button>
              </div>
            </div>
            <div className="width100 zeromargin">
              <div className="form authform downcorner zeromargin">
                <div>
                  <form onSubmit={(event) => this.login(event)}>
                    <h2 className="zeromargin left width100">
                    {this.state.option == 0 ? "Авторизация" : "Регистрация"}
                    </h2>
                    {this.state.option == 1 ?
                    <div className="width100">
                      <input
                        type="text"
                        className="form width50 leftcorner"
                        value={this.state.surname}
                        onChange={event => this.surname(event.target.value)}
                        placeholder="Фамилия"
                      />
                      <input
                        type="text"
                        className="form width50 rightcorner"
                        value={this.state.name}
                        onChange={event => this.name(event.target.value)}
                        placeholder="Имя"
                      />
                    </div>:""}
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
                      {this.state.option == 0 ? "Войти" : "Зарегистрироваться"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </center>:
          <Redirect to="/test"/>
        }
        </div>
        <div className="info-about-tr-p">

        </div>
        </div>

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
