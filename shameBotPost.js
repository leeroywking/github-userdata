'use strict'
const superagent = require('superagent');
const webhook = process.env.webhook || require('./.env.js').webhook;

async function shameBotPost(message) {
    await superagent.post(webhook).send({ "text": message, as_user:true,
})
}

module.exports = shameBotPost