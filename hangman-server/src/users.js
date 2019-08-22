const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  score: { type: Number, required: true },
  currentWord: { type: String, required: false },
  lettersGuessed: { type: String, required: false },
});

const User = mongoose.model('User', UserSchema);

function getUserObject(req, res, next) {
  User.findOne({email: req.user.email}, (err, user) => {
     if (err || !user) {
         res.status('400').json({status: 'user-missing'});
     }
     req.userObj = user;
     next();
  });
}

module.exports = { UserSchema, User, getUserObject };
