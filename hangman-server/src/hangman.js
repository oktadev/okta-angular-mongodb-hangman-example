const express = require('express');
const users = require('./users');
const fs = require("fs");

function createRouter(db) {
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
             users.getUserObject,
             async (req, res, next) => {
    const user = req.userObj;
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
             users.getUserObject,
             function (req, res, next) {
    const user = req.userObj;
    if (!user.currentWord) {
      return res.status(400).json({status: 'no-game'});
    } else {
      const c = req.body.guess[0].toUpperCase();
      if (!user.lettersGuessed.includes(c)) {
          user.lettersGuessed += c;
      }
      const clue = makeClue(user.currentWord, user.lettersGuessed);
      let respone;
      if (user.lettersGuessed.length>6 && clue.includes('_')) {
        response = {
            status: 'lost',
            clue: user.currentWord,
            guesses: user.lettersGuessed
        };
        user.currentWord = '';
        user.lettersGuessed = '';
      } else if (!clue.includes('_')) {
        response = {
            status: 'won',
            clue: user.currentWord,
            guesses: user.lettersGuessed
        };
        user.currentWord = '';
        user.lettersGuessed = '';
      } else {
        response = {
            status: 'ok',
            clue: makeClue(user.currentWord, user.lettersGuessed),
            guesses: user.lettersGuessed
        };
      }
      user.save().then(() => {
        res.status(200).json(response);
      });
    }
  });

  router.get('/profile',
             users.getUserObject,
             function (req, res, next) {
    const user = req.userObj;
    res.status(200).json({
        email: user.email,
        username: user.username,
        score: user.score
    });
  });

  router.put('/profile', (req, res, next) => {
    users.User.exists({email: req.user.email}).then((exists) => {
      if (exists) {
        return res.status(400).json({status: 'user-exists'});
      }
      return users.User.create({email: req.user.email, username: req.body.username, score: 0});
    }).then((user) => {
        if (user) res.status(200).json({status: 'ok'});
    });
  });

  router.get('/leaderboard', function (req, res, next) {
    users.User.find()
              .sort({ score: 'desc'})
              .select('username score')
              .limit(20)
              .then(result => {
          res.status(200).json(result.map(entry => ({
              username: entry.username,
              score: entry.score
          })));
      });
  });

  return router;
}

module.exports = createRouter;
