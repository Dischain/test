//models/votations/factory.js
// добавить в запросы выборки по голосованиям поле craetedAt.
case constants.GET_FULL_VOTATION_BY_ID:
      return 'SELECT vtn.title, vtn.description, vtn.id votationId, vtn.creator_id creatorId, '
           + 'vtn.created_at createdAt, vt.value, u.name, u.id userId FROM '
           + 'votations vtn LEFT JOIN votes vt ON vtn.id = vt.votation_id '
           + 'INNER JOIN users u ON vt.creator_id = u.id '
           + 'WHERE vtn.id = ' + data.id + ';';
case constants.FIND_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET:
  return 'SELECT vtn.title, vtn.description, vtn.id votationId, vtn.creator_id creatorId, '
       + 'vtn.created_at createdAt, vt.value, u.name, u.id userId FROM '
       + 'votations vtn LEFT JOIN votes vt ON vtn.id = vt.votation_id '
       + 'INNER JOIN users u ON vt.creator_id = u.id '
       + 'WHERE MATCH (vtn.title,vtn.description) AGAINST (' + data.text + ') '
       + 'ORDER BY vtn.created_at DESC '
       + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';              

// routes/votation.js
const router = require('express').Router()
    , passport = require('passport')
    , modelNames = require('../model').modelNames
    , votations = require('../model').getModel(modelNames.VOTATION_MODEL)
    , votationsConstants = require('../model/votations').constants
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , usersConstants = require('../model/users').constants;

router.post('/votations', users.isAuthenticated, (req, res) => {
   const votationData = req.body.votationData
       , votes = req.body.votes;
     
   let votationId; 
   votations.query(votationsConstants.CREATE_VOTATION, votationData)
   then((result) => {
      votationId = result.insertId;

      return votes.reduce((initial, vote) => {
          vote.votation_id = votationId;
          return initial.then(() => votes.query(votesConstant.CREATE_VOTE), vote);
      }, Promise.resolve());
   })
   .then(() => res.status(201).json(JSON.stringify({ votationId: votationId })))
   .catch((err) => res.sendStatus(500));
});

// 
router.get('/votations', users.isAuthenticated, (req, res) => {
    votations.query(votationsConstants.GET_ALL_WITH_VOTES_LIMITED_BY_OFFSET, { 
        limit: req.body.limit,
        offset: req.body.offset
    })
    .then((result) => {
      let combinedVotations = _combineVotesByVotations(result);
      res.status(200).json(JSON.stringify(combinedVotations));
    })
    .catch((err) => res.sendStatus(500));
});

router.get('/votations/:id', users.isAuthenticated, (req, res) => {
    const votationId = req.params.id;

    votations.query(votationsConstants.GET_FULL_VOTATION_BY_ID, { id: votationId })
    .then((result) => {
        if (result.length === 0)
            return res.sendStatus(404);

        let votationData = {
            title: result[0].title,
            description: result[0].description,
            creatorId: result[0].creatorId,
            votationId: votationId,
            createdAt: result[0].createdAt
        };

        let votes = result.map((item) => {
            return { value: item.value, creatorId: item.userId, name: item.name };
        });

        res.status(200).json(JSON.stringify({
            votationData: votationData,
            votes: votes;
        }));
    })
    .catch((err) => res.sendStatus(500));
});

router.get('/votations_search', (req, res) => {
   votations.query(votationsConstants.FIND_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET, {
       text: req.body.text, limit: req.body.limit, offset: req.body.offset
   })
   .then((result) => {
      let combinedVotations = _combineVotesByVotations(result);
      res.status(200).json(JSON.stringify(combinedVotations));
   })
   .catch((err) => res.sendStatus(500));
});

router.get('/votations_by_user', (req, res) => {
   votations.query(votationsConstants.GET_USER_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET, {
       creatorId: req.body.creatorId, limit: req.body.limit, offset: req.body.offset
   })
   .then((result) => {
      let combinedVotations = _combineVotesByVotations(result);
      res.status(200).json(JSON.stringify(combinedVotations));
   })
   .catch((err) => res.sendStatus(500));
});

router.delete('/votations/:id', (req,res) => {
    votations.query(votationsConstants.DELETE_VOTATION_BY_ID, { id: req.params.id })
    .then(() => res.sendStatus(201))
    .catch((err) => res.sendStatus(500));
});

function _combineVotesByVotations(result) {
  let lastVisitedVotationId = 0, combinedVotations = [];
    
  for(let i = lastVisitedVotationId; i < result.length; i++) { 
    let item = result[i];

    if (i !== 0 && item.votationId === result[i - 1].votationId)
      continue;
    else {
      let votationData = {
        title: item.title,
        description: item.description,
        votationId: item.votationId,
        creatorId: item.creatorId,
        createdAt: result[0].createdAt
      }, votes = [];
          
      for (let j = i; j < result.length ; j++) {
        lastVisitedVotationId = j;
          
        if (item.votationId !== result[j].votationId)
          break;
        else {
          votes.push({
            value: result[j].value,
            creatorId: result[j].userId,
            name: result[j].name
          });
        }
      }
          
      combinedVotations.push({
        votationData: votationData,
        votes: votes
      });
    }
  }
  
  return combinedVotations;
}

module.exports = router;

//test/integration/user.test.js
describe('User Routes', () => {
  beforeEach((done) => {
    users.query(userConstants.CLEAR_TABLE).then(() => done());
  });

  describe('login', () => {
    before((done) => {
        users.query(userConstants.CLEAR_TABLE)
        .then(() => users.register(userData))
        .then(() => done());
    })

    it('should login user', (done) => {
      chai.request(server)
      .post('/login')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(200);        
        done();
      });
    });

    it('Should not login user with invalid credentials', () => {
      chai.request(server)
      .post('/login')
      .send({ email: 'invalid', password: 'invalid'})
      .end((err, res) => {
        res.should.have.status(401);
      });
    });
  });
});
