'use strict';

const botHelper = require('../lib/botHelper');

class Bot {
  constructor(opts) {
    // Create an ES6 Map to store our regular expressions
    this.keywords = new Map();
    botHelper.defineRtmClientOpts(this, opts);
    botHelper.createConnection(this);
    botHelper.listenForMessages(this);
    this.slack.start();
  }
  // Send a message to a channel, with an optional callback
  send(message, channel, cb) {
    this.slack.sendMessage(message, channel.id, () => {
      if (cb) {
        cb();
      }
    });
  }
  respondTo(keywords, callback, start) {
    // If 'start' is truthy, prepend the '^' anchor to instruct the
    // expression to look for matches at the beginning of the string
    if (start) {
      keywords = '^' + keywords;
    }
    // Create a new regular expression, setting the case
    // insensitive (i) flag
    let regex = new RegExp(keywords, 'i');

    // Set the regular expression to be the key, with the callback
    // function as the value
    this.keywords.set(regex, callback);
  }
}

module.exports = Bot;
