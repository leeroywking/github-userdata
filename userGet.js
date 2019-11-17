'use strict'
const superagent = require('superagent');
const token = process.env.GITHUBTOKEN || require('./.env.js');
const user = 'leeroywking'
// https://api.github.com/users/
const user2 = 'leeroywking';

async function  getter(queryUser){
    const URL = `https://api.github.com/users/${queryUser}/events`;
    const response = await superagent.get(URL)
    .set('User-Agent', `${user}`)
    .set('Authorization', `token ${token}`)
    .catch(err => console.error(err))
    console.log(response.body[0])
}

getter(user2);

// this authorization line is necessary if you want to make a larger number of requests
// if you get a failure message that mentions being throttled you will need this line
// blah blah blah blah