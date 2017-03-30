const errors = require('./errorHandler');
const messages = require('./messageHelper');
const bot = require('./botSingleton');
let request = require('request');

request = request.defaults({
  jar: true
});

module.exports = {
  getGameOnSlack: function (channel) {
    request({
      url: 'http://35.158.79.64:3000/game',
      method: 'GET',
    }, (err, res, body) => {
      errors.sendErrorMsgToSlack(err);
      let gameParameters = JSON.parse(body);
      messages.printCurrentGame(gameParameters, channel);
    });
  },
  checkLetter: function (letterToGuess, channel) {
    if(messages.checkIfIncorrectInputLetter(letterToGuess, channel)) {
      return;
    }
    request({
      url: `http://35.158.79.64:3000/letter/${letterToGuess}`,
      method: 'GET',
    }, (err, res, body) => {
      errors.sendErrorMsgToSlack(err);
      if (!body) {
        return bot.send('Game not found. Type "hangman" first', channel);
      }
      let gameParameters = JSON.parse(body);
      messages.printIfWrongLetter(gameParameters, channel);
      messages.printUpdatedResult(gameParameters, channel);
      messages.printIfGameOver(gameParameters, channel);
    });
  }
};
