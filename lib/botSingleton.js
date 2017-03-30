const Bot = require('../classes/bot');

const bot = new Bot({
  token: process.env.SLACK_TOKEN,
  autoReconnect: true,
  autoMark: true
});

module.exports = bot;
