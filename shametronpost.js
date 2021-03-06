const SlackBot = require('slackbots');

module.exports = function (message) {
let bot = new SlackBot({
    token: process.env.SLACKBOT || require('./.env.js').slack, // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: 'shametron'
});

bot.on('start', function(data) {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        // icon_emoji: ':cat:'
        disconnect:true,
        as_user:true,
        parse:"full"
    };
    console.log(data)
    // define private group instead of 'private_group', where bot exist
    bot.postMessageToChannel('shamebot', `${message}`, params); 
    // bot.postMessageToChannel('everyone', `${message}`, params);
});
}
