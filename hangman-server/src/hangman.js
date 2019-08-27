const express = require('express');
const users = require('./users');
const fs = require("fs");

function createRouter() {
  const router = express.Router();
  const words = fs.readFileSync('./src/words.txt')
                  .toString()
                  .split('\n')
                  .map(w => w.trim().toUpperCase())
                  .filter(w => w!=='');

  function makeClue(word, letters) {
    return word.split('').map(c => letters.includes(c) ? c : '_').join('');
  }
  
  router.get('/game',
              users.getUserDocument,
              async (req, res, next) => {
    const user = req.userDocument;
    if (!user.currentWord) {
      const newWord = words[Math.floor(Math.random()*words.length)];
      user.currentWord = newWord;
      user.lettersGuessed = '';
      await user.save();
    }
    res.status(200).json({
        status: 'ok',
        clue: makeClue(user.currentWord, user.lettersGuessed),
        guesses: user.lettersGuessed
    });
  });
  
  router.put('/game',
           users.getUserDocument,
           async (req, res, next) => {
    const user = req.userDocument;
    if (!user.currentWord) {
      return res.status(400).json({status: 'no-game'});
    } else {
      const c = req.body.guess[0].toUpperCase();
      if (!user.lettersGuessed.includes(c)) {
          user.lettersGuessed += c;
      }
      const clue = makeClue(user.currentWord, user.lettersGuessed);
      const response = {
          clue: clue,
          guesses: user.lettersGuessed
      };

      if (user.lettersGuessed.length>6 && clue.includes('_')) {
        response.status = 'lost';
        response.clue = user.currentWord;
        user.currentWord = '';
        user.lettersGuessed = '';
      } else if (!clue.includes('_')) {
        response.status = 'won';
        user.currentWord = '';
        user.lettersGuessed = '';
      } else {
        response.status = 'ok';
      }
      await user.save();
      res.status(200).json(response);
    }
  });

  router.get('/profile',
           users.getUserDocument,
           (req, res, next) => {
    const user = req.userDocument;
    res.status(200).json({
        email: user.email,
        username: user.username,
        score: user.score
    });
  });

  router.put('/profile', async (req, res, next) => {
    const exists = await users.User.exists({email: req.user.email});
    if (exists) {
      return res.status(400).json({status: 'user-exists'});
    }
    await users.User.create({email: req.user.email, username: req.body.username, score: 0});
    res.status(200).json({status: 'ok'});
  });

  router.get('/leaderboard', async (req, res, next) => {
    const result = await users.User.find()
                                   .sort({ score: 'desc'})
                                   .limit(20)
                                   .select('username score');
    res.status(200).json(result.map(entry => ({
      username: entry.username,
      score: entry.score
    })));
  });
  
  return router;
}

module.exports = createRouter;
