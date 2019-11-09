import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import moment from 'moment';
import publicIp from 'public-ip';

export const Informations = new Mongo.Collection('informations');

if (Meteor.isServer) {
  Meteor.publish('informations', function informationsPublication() {
      return Informations.find();
    }
  );
}
var meteorError = new Meteor.Error();
if (Meteor.isClient) {
  return meteorError;
}
Meteor.methods({
  'informations.insert'(username, password, surname, name) {
    check(username, String);
    check(password, String);
    check(surname, String);
    check(name, String);
    const list = Informations.find().map((list) => list.username);
    if(!list.includes(username)) {
      Informations.insert({
        username,
        password,
        surname,
        name,
        messages: [],
        status: "blocked",
        createdAt: new Date(),
      });
    }
  },
  'informations.remove'(informationId, username) {
    check(informationId, String);
    check(username, String);
    send(username, "Доступ ограничен.");
    Informations.remove(informationId);
  },
  'informations.sendSystemMessage'(username, message) {
    check(username, String);
    check(message, String);
    send(username, message);
  },
  'informations.sendMessage'(username, message) {
    check(username, String);
    check(message, String);
    send(username, message);
  },
  'informations.setusername'(username, newusername) {
    check(username, String);
    check(newusername, String);
    const tg = Informations.findOne({username: username});
    Informations.update(tg._id, { $set: { username: newusername } });
  },
  'informations.setstatus'(username, status) {
    check(username, String);
    check(status, String);
    try{
      const info = Informations.findOne({username: username});
      Informations.update(info._id, { $set: { status: status } });
    } catch (error) {
      console.log(error)
    }
  },
});
