'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const app = express();
const userCheck = require('./userGet.js');
// const users = require('./userslist.js');
// const shametron = require('./shametronpost.js');
const shameBotPost = require('./shameBotPost.js')
const mongoose = require('mongoose');



const database = process.env.MONGODB_URI || require('./.env.js').MONGODB_URI

mongoose.connect(database);


var userSchema = new mongoose.Schema({
  userName: String,
});
var User = mongoose.model("User", userSchema);



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
  let users = await getTheSlackers()
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
  shameBotPost(`Here are our naughty coders of the day ${naughtylist}`)
}

async function getTheSlackers(){
  
  return new Promise((res,rej) => {
  User.find({})
  .then(data => {
    let messOfUsers = data.map(user => user.userName)
    let setOfUsers = new Set()
    messOfUsers.forEach(username => setOfUsers.add(username))
    let dedupUsers = Array.from(setOfUsers)
    res(dedupUsers)
  })
  .catch(e => rej(e))
  })
};

function signup(req,res){
  let newUser = new User({userName:req.body.text}) //assign user here
  newUser.save()
  .then(item => {
    res.send('it saved (probably)');
  })
  .catch(err => {
    res.status(400).send('it didn\'t save :(');
  });
};

app.post('/', reply);
app.get('/getit',getTheSlackers)
app.post('/signup',signup);

app.listen(PORT);
