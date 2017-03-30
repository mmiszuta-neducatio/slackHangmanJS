module.exports = {
  sendErrorMsgToSlack: function(err = false) {
     if (err) {
      console.error(err);
      bot.send('An error occurred: ' + err, channel);
    }
  }
};
