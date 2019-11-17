'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const jsonObject = { hello: 'world' };

function reply(req, res) {
  res.send(jsonObject);
}


app.get('/', reply);

app.listen(PORT);
