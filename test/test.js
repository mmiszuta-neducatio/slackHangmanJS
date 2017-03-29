'use strict';
const sinon = require('sinon');
const assert = require('chai').assert;

const Bot = require('../bot');
const bot = new Bot({
    token: process.env.SLACK_TOKEN,
    autoReconnect: true,
    autoMark: true
});

describe('Bot', function () {
    it('should send a message to the specific channel', function (done) {
        setTimeout(function () {
            bot.send('this is a testing message', {
                id: 'D4A4FG8KT'
            }, done);
        }, 1500);
    });
});
