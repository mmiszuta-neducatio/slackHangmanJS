const bot = require('./botSingleton');

function changeResultToBeReadable(gameParameters) {
  let result = new Array(gameParameters.guessedLetters.length);
  for (let i = 0; i < gameParameters.guessedLetters.length; i++) {
    if (gameParameters.guessedLetters[i] === null) {
      result[i] = '_';
      continue;
    }
    result[i] = gameParameters.guessedLetters[i];
  }
  return result.join('');
}

module.exports = {
  printCurrentGame: function (gameParameters, channel) {
    bot.send(`${changeResultToBeReadable(gameParameters)}
    remaining attempts: ${gameParameters.remainingAttempts}
    games won: ${gameParameters.gameStats.won}
    games lost: ${gameParameters.gameStats.lost}`,
      channel);
  },
  printIfWrongLetter: function (gameParameters, channel) {
    if (gameParameters.isValid === false) {
      bot.send('Not this time, try again', channel);
    }
  },
  printIfGameOver: function (gameParameters, channel) {
    if (gameParameters.isGameOver === true) {
      if (gameParameters.gameOverType === 'loss') {
        return bot.send('You have lost try again by typing "hangman"', channel);
      }
      return bot.send('You have won - Congrats, you can play again, simply type "hangman"', channel);
    }
  },
  checkIfIncorrectInputLetter: function (letterToGuess, channel) {
    if (/[^a-zA-Z]/.test(letterToGuess)) {
      bot.send('you can guess only english letters', channel);
      return true;
    }
    if (letterToGuess.length !== 1) {
      bot.send('you can guess only one letter at a time or you forgot a space after "letter:"', channel);
      return true;
    }
  },
  printUpdatedResult: function (gameParameters, channel) {
    return bot.send(`${changeResultToBeReadable(gameParameters)} 
    You have ${gameParameters.remainingAttempts} attempts left`, channel);
  }
};