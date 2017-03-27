'use strict';

const Bot = require('./bot');
let request = require('request');

const bot = new Bot({
  token: process.env.SLACK_TOKEN,
  autoReconnect: true,
  autoMark: true
});

request = request.defaults({jar: true});

bot.respondTo('help', (message, channel) => {
  bot.send('To start a new game type \'hangman\', to guess a letter (for example x) type \'letter: x\'', channel);
}, true);

bot.respondTo('hangman', (message, channel) => {
  request({
    url: 'http://35.156.165.137:3000/game',
    method: 'GET',
}, (err, res, body) => {
    if (err) {
      console.error(err);
      return;
    }
    let JSONresponse = JSON.parse(body);
    bot.send(Array(JSONresponse.guessedLetters.length + 1).join('_') + '\n' + 'remainingAttempts:', channel);
  });
}, true);

bot.respondTo('letter:', (message, channel) => {
  let letterToGuess = message.text.split(' ').slice(1).join('');
  if (letterToGuess.length !== 1) {
    bot.send('you can guess only one letter at a time', channel);
    return;
  }
  if (/[^a-zA-Z]/.test(letterToGuess)) {
    bot.send('you can guess only english letters', channel);
    return;
  }
  request({
    url: `http://35.156.165.137:3000/letter/${letterToGuess}`,
    method: 'GET',
}, (err, res, body) => {
    if (err) {
      console.error(err);
      return;
    }
    let JSONresponse = JSON.parse(body);
    console.log(JSONresponse);
    let result = new Array(JSONresponse.guessedLetters.length);
    for(let i = 0; i < JSONresponse.guessedLetters.length; i++) {
      if(JSONresponse.guessedLetters[i] === null){
        result[i] = '_';
        continue;
      }
      result[i] = JSONresponse.guessedLetters[i];
    }
    bot.send(result.join(''), channel);
  });
}, true);
