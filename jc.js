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

// routes/user.js
const router = require('express').Router()
    , passport = require('passport')
    , modelNames = require('../model').modelNames
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants;

router.post('/register', (req, res) => {
  const credentials = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  users.register(credentials)
  .then((result) => res.status(201).json(JSON.stringify({userId: result.insertId})))
  .catch((err) => {
      if (err.message === constants.EMAIL_EXISTS)
        res.status(409).json(JSON.stringify({message: constants.EMAIL_EXISTS})); 
      else if// и т.д.
      else
        res.sendStatus(500);
  });
});

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (user) {
      req.logIn(user, (err) => {
        if (err) return next(err);

        let userData = {
          name: user.name,
          email: user.email,
          userId: user.id
        };

        res.status(200).json(JSON.stringify(userData));
      });
    } else {

      res.sendStatus(401);
    }
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();

  req.session = null;

  res.sendStatus(200);
});

router.get('/users', (req, res) => {
   users.query(userConstants.GET_ALL_LIMITED_WITH_OFFSET, {
       limit: req.body.limit, offset: req.body.offset
    })
   .then((result) => res.json(JSON.stringify({ users: result })));
   .catch((err) => res.sendStatus(500));
});

router.get('/users/:id', (req, res) => {
   users.query(userConstants.GET_USER_BY_ID, { id: req.body.id })
   .then((result) => res.json(JSON.stringify(result)));
   .catch((err) => res.sendStatus(500));
});

　
module.exports = router;

// routes/votation.js
const router = require('express').Router()
    , passport = require('passport')
    , modelNames = require('../model').modelNames
    , votations = require('../model').getModel(modelNames.VOTATION_MODEL)
    , votationsConstants = require('../model/votations').constants;

router.post('/votations',  (req, res) => {
   const votationData = req.body.votationData
       , votes = req.body.votes;
     
   let votationId; 
   votations.query(votationsConstants.CREATE_VOTATION, votationData)
   then((result) => {
      votationId = result.insertId;

      return votes.reduce((initial, vote) => {
          vote.votation_id = result.insertId;
          return initial.then(() => votes.query(votesConstant.CREATE_VOTE), vote);
      }, Promise.resolve());
   })
   .then(() => res.status(201).json(JSON.stringify({ votationId: votationId })))
   .catch((err) => res.sendStatus(500));
});

　
//test/integration/user.test.js
const chai = require('chai')
    , chaiHttp = require('chai-http')
    , server = require('../app/app.js')

    , modelNames = require('../model').modelNames
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants
    , expect = chai.expect
    , should = chai.should();

chai.use(chaiHttp);

describe('User Routes', () => {
  const userData = {
    name: 'user',
    email: 'user@email.com',
    password: 'password'
  },
  userData2 = {
    name: 'user2',
    email: 'user2@email.com',
    password: 'password'
  };

  let userId, userId2;

  beforeEach((done) => {
    users.query(userConstants.CLEAR_TABLE).then(() => done());
  });

  describe('Register', () => {
    it('should register new user', (done) => {
      chai.request(server)
      .post('/register')
      .send(userData)
      .end((err, res) => {
        const body = JSON.parse(res.body);

        expect(body).to.haveOwnProperty('userId');
        res.should.have.status(201);
        
        userId = body.userId;

        done();
      });
    });

　
    it('should return user data for created user userId', (done) => {
      const userPath = '/users/' + userId;

      chai.request(server)
      .get(userPath)
      .end((err, res) => {
        const body = JSON.parse(res.body);
        
        res.should.have.status(200);
        expect(body.name).to.equal(userData.name);
        expect(body.email).to.equal(userData.email);
        expect(body.userId).to.equal(userId);
        done();
      });
    });
  });

  describe('Get users', () => {
      it('should return all users limitied with offset', (done) => {
        users.register(userData)
        .then((result) => {
            userId = result.insertId; 
            return Promise.resolve();
        })
        .then(() => users.register(userData2))
        .then((result) => {
            userId2 = result.insertId; 
            return Promise.resolve();
        })
        .then(() => chai.request(server))
        .get('/users')
        .send({ limit: 10, offset: 0 })
        .end((err, res) => {
            const body = JSON.parse(res.body);

            res.should.have.status(200);
            expect(body.users.length).to.equal(2);
            done();
        })
      });

      it('should return user by id', (done) => {
          const userPath = '/users/' + userId;

          chai.request(server)
          .get(userPath)
          .end((err, res) => {
              const body = JSON.parse(res.body);
        
              res.should.have.status(200);
              expect(body.name).to.equal(userData.name);
              expect(body.email).to.equal(userData.email);
              expect(body.userId).to.equal(userId);
              done();
          });
      });
  });
});
