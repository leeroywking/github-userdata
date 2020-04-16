'use strict'
const superagent = require('superagent');
const token = process.env.GITHUBTOKEN || require('./.env.js').github;
const user = 'leeroywking'
// https://api.github.com/users/
const user2 = 'leeroywking';

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

async function  userCheck(queryUser){
    const URL = `https://api.github.com/users/${queryUser}/events`;
    console.log(URL)
    const response = await superagent.get(URL)
    .set('User-Agent', `${user}`)
    .set('Authorization', `token ${token}`)
    .catch(err => console.error(err))
    const dates = response.body.map(item => new Date(item.created_at).addHours(-8.5).toISOString().substr(0,10))
    const today = new Date().addHours(-8.5).toISOString().substr(0,10)
    return {[queryUser]:dates.includes(today)}
}

module.exports = userCheck
// this authorization line is necessary if you want to make a larger number of requests
// if you get a failure message that mentions being throttled you will need this line
// blah blah blah blah
