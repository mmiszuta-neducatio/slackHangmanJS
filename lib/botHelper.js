const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;

module.exports = {
  createConnection: function (bot) {
    bot.slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      let user = bot.slack.dataStore.getUserById(bot.slack.activeUserId);
      let team = bot.slack.dataStore.getTeamById(bot.slack.activeTeamId);
      bot.name = user.name;
      console.log(`Connected to ${team.name} as ${user.name}`);
    });
  },
  listenForMessages: function (bot) {
    bot.slack.on(RTM_EVENTS.MESSAGE, (message) => {
      // Only process text messages
      if (!message.text) {
        return;
      }

      let channel = bot.slack.dataStore.getChannelGroupOrDMById(message.channel);
      let user = bot.slack.dataStore.getUserById(message.user);

      // Loop over the keys of the keywords Map object and test each
      // regular expression against the message's text property
      for (let regex of bot.keywords.keys()) {
        if (regex.test(message.text)) {
          let callback = bot.keywords.get(regex);
          callback(message, channel, user);
        }
      }
    });
  },
  defineRtmClientOpts: function (bot, opts) {
    bot.slack = new RtmClient(opts.token, {
      logLevel: 'error',
      dataStore: new MemoryDataStore(),
      autoReconnect: opts.autoReconnect || true,
      autoMark: opts.autoMark || true
    });
  }
};
