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

            userData.password = hash;

            userModel.query(exports.constants.CREATE_USER, userData)
            .then(resolve)
            .catch(reject);
         });
       });
    });
};

exports.validatePassword = (credentials, password) => {
    return new Promise((resolve, reject) => {
       users.query(exports.constants.GET_USER_BY_EMAIL, { email: credentials.email }) 
       .then((user) => {
          if (user.length === 0) return reject(new Error('invalid email'));

          const actualPassword = user.password;

          bcrypt.compare(actualPassword, password, (err, match) => {
             if (err) return reject(new Erro('invalid password')) 

             resolve(match);
          });
       });
    });
};

　
exports.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
		next();
	}else{
		res.sendStatus(401);
	}
}

exports.authorize = (votation) => {

}

//users.test.js
describe('simple authentication layer', () => {
    const credentials = {
        name: 'vasya',
        email: 'nagibator99@mail.ru',
        password: 'ubernagibatormamkarotbal_13'
    };
    let userId;

    describe('register', () => {
      it('should register new user and hash password', (done) => {
        users.register(credentials)
        .then((result) => users.query(userConstants.GET_USER_BY_ID, result.insertId))
        .then((user) => {
           console.log(user);
           expect(user[0].name).to.equal(credentials.name);
           expect(user[0].email).to.equal(credentials.email);
           expect(user[0].password).to.not.equal(credentials.password);
           done();
        });
      });
    });

    describe('validatePassword', () => {
       it('should return false on invalid password', (done) => {
          users.validatePassword(credentials, 'blah') 
          .then((match) => {
              expect(match).to.equal(false);
              done();
          });
       });

       it('should return true on valid password', (done) => {
          users.validatePassword(credentials, credentials.password) 
          .then((match) => {
              expect(match).to.equal(true);
              done();
          });
       });
    });
});

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
