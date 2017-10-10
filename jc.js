// module/users/index.js
const bcrypt = require('bcrypt-nodejs')
    , userModel = require('../index.js').getModel('USERS_MODEL')
    , SALT_WORK_FACTOR = 10;

exports.register = (userData) => {
    if (userData.avata === undefined)
        userData.avatar = constants.DEfAULT_AVATAR_PATH; //путь к дефолтному аватару
    
    return new Promise((resolve, reject) => {
       bcrypt.genSalt(constants.SALT_WORK_FACTOR, (err, salt) => {
         if(err) return reject(err);

         bcrypt.hash(userData.password, salt, null, (err, hash) => {
            if(err) return reject(err);

            // userData.password = hash; - стереть
            ///////////////////////////////////////////////////
            userModel.query(exports.constants.CREATE_USER, { //
                name: userData.name,                         //
                email: userData.email,                       // 
                password: hash                               //
            ///////////////////////////////////////////////////    
            })
            .then(resolve)
            .catch(reject);
         });
       });
    });
};

// сохраняет голосование и его результаты
function commitVotation(votationData, votes) {
    votations.query(votationsConstants.CREATE_VOTATION, votationData)
    .then((result) => {
        return votes.reduce((init, vote) => {
            vote.votation_id = result.insertId;
            return init.then(() => votes.query(votesConstant.CREATE_VOTE), vote);
        }, Promise.resolve());
    })
}

// auth/index.js
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , modelNames = require('../model').modelNames
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants;

let init = function() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {    
    users.query(userConstants.GET_USER_BY_ID, {id: id})
    .then((user) => done(null, user));
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, (email, password, done) => {

      users.query(userConstants.GET_USER_BY_EMAIL, {email: email})
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        users.validatePassword(user, password)
          .then((isMatch) => {
            isMatch ? 
              done(null, user) : 
              done(null, false, { message: 'Incorrect username or password'})
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));

  return passport;
};

module.exports = init();
