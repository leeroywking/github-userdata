'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const app = express();
const userCheck = require('./userGet.js');
const users = require('./userslist.js');
const shametron = require('./shametronpost.js');


// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

async function reply(req, res) {
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


app.post('/', reply);


app.listen(PORT);
