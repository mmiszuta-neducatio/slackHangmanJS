'use strict';

const bot = require('./lib/botSingleton');
const connectToAPI = require('./lib/requestHelper');

bot.respondTo('help', (message, channel) => {
  bot.send('To start a new game type \'hangman\', to guess a letter (for example x) type \'letter: x\'', channel);
}, true);

bot.respondTo('hangman', (message, channel) => {
  connectToAPI.getGameOnSlack(channel);
}, true);

// Bot will respond to "letter: x". Space between ":" and your letter is required
bot.respondTo('letter:', (message, channel) => {
  let letterToGuess = message.text.split(' ').slice(1).join('');
  connectToAPI.checkLetter(letterToGuess, channel);
}, true);
