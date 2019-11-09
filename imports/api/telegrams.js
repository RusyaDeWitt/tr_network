import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Qiwi } from 'node-qiwi-api';
import Telegraf from 'telegraf';
import Extra from 'telegraf/extra';
import Markup from 'telegraf/markup';
import Telegram from 'telegraf/telegram';
import SimpleCrypto from "simple-crypto-js";
import { Accounts } from 'meteor/accounts-base';
import moment from 'moment';
import publicIp from 'public-ip';

export const tgbot = new Telegraf("966059736:AAFBHJ5QXQEwU_XTx_12-fgt3fyqBbXkM2s");
export const Telegrams = new Mongo.Collection('telegrams');

if (Meteor.isServer) {
  Meteor.publish('telegrams', function telegramsPublication() {
      return Telegrams.find();
    }
  );
}
var meteorError = new Meteor.Error();
if (Meteor.isClient) {
  return meteorError;
}
Meteor.methods({
  'telegrams.insert'(chatid) {
    check(chatid, String);
    const tglist = Telegrams.find().map((tg) => tg.chatid);
    if(!tglist.includes(chatid)) {
      Telegrams.insert({
        chatid,
        username: chatid,
        status: "blocked",
        createdAt: new Date(),
      });
    }
  },
  'telegrams.remove'(telegramId, chatid) {
    check(telegramId, String);
    check(chatid, String);
    send(chatid, "Доступ ограничен.");
    Telegrams.remove(telegramId);
  },
  'telegrams.sendSystemMessage'(chatid, message) {
    check(chatid, String);
    check(message, String);
    send(chatid, message);
  },
  'telegrams.sendMessage'(chatid, message) {
    check(chatid, String);
    check(message, String);
    send(chatid, message);
  },
  'telegrams.setusername'(chatid, username) {
    check(chatid, String);
    check(username, String);
    const tg = Telegrams.findOne({chatid: chatid});
    Telegrams.update(tg._id, { $set: { username: username } });
  },
  'telegrams.setstatus'(chatid, status) {
    check(chatid, String);
    check(status, String);
    try{
      if(status == "user"){
        send(chatid, "Предоставлен доступ!\n/help - Список доступных команд");
      }
      if(status == "blocked"){
        send(chatid, "Доступ ограничен.");
      }
      const tg = Telegrams.findOne({chatid: chatid});
      Telegrams.update(tg._id, { $set: { status: status } });
    } catch (error) {
      console.log(error)
    }
  },
});
