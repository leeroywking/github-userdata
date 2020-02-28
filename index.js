'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const userCheck = require('./userGet.js');
const users = require('./userslist.js');
const shametron = require('./shametronpost.js');
const mongoose = require('mongoose');



async function reply(req, res) {
  console.log({req})
  if(req.body.challenge){
    res.send({"challenge":req.body.challenge})
  }
  const promiseArr = [];
  let results = {}
  users.forEach(user => promiseArr.push(userCheck(user)))
  let responses = await Promise.all(promiseArr)
  responses.forEach(result => results = {...results, result})
  res.send(responses);
  let naughtylist = [];
  for(let person of responses){
    for(let committed in person){
      if(!person[committed]){
        naughtylist.push(`@${committed}`)
      }
    }
  }
  shametron(`Here are our naughty coders of the day ${naughtylist}`);
}

function addUser(req,res,next){
  console.log(req);
  let user = req.body//assign user here
  user.save()
  .then(item => {
    res.send('it saved (probably)');
  })
  .catch(err => {
    res.status(400).send('it didn\'t save :(');
  });
};

app.get('/', reply);
app.post('/addUser',addUser);

app.listen(PORT);
