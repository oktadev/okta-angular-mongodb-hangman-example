const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bearerToken = require('express-bearer-token');
const oktaAuth = require('./auth');
const hangman = require('./hangman');

const port = process.env.PORT || 8080;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bearerToken())
  .use(oktaAuth)
  .use(hangman());

mongoose.connect(`mongodb://localhost:27017/hangman`)
.then(() => {
  console.log('Connected to database');
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
});
