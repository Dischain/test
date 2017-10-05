/*                        /model
*******************************************************************************/
// model/index.js
const usersQueryFactory     = require('./users/factory.js')
    , votationsQueryFactory = require('./votations/factory.js')
    , votesQueryFactory   = require('./votes/factory.js');

exports.modelNames = {
    USERS_MODEL: 'users',
    VOTATIONS_MODEL: 'votations',
    VOTES_MODEL: 'votes'
};

/** Example:
 * const modelNames = require('./models).modelNames
 *     , users = require('./models').getModel(modelNames.USERS_MODEL)
 *     , userConstants = require('./models/users').constants;
 *
 * users.query(userConstants.CREATE_USER, {...rawData}).then(() => { // dosometh... });
 */
exports.getModel = (modelName) => {

  let factory = _mapModelNameToFactory(modelName);

  return {
    query: (query, rawData, middleware) => {
      let escapedData;
      const args = arguments;

      if (_.isPlainObject(rawData)) {
        escapedData = Object.keys().reduce((init, key) => {
          return init.key = mysql.escape(rawData[key]);
        }, {});
      } else {
        escapedData = mysql.escape(rawData);
      }

      return new Promise((resolve, reject) => {
        db.getConnection.then((con) => {
          con.query(factory(query, escapedData), (err, result) => {
            if (err) return reject(err);

              if (middleware !== undefined) {
                  middleware = (typeof middleware === 'function') ? middleware : function() {};
                  
                  middleware(escapedData).then((err, result) => {
                      if (err) return reject(err);
                      resolve(result);
                  });
              } else {
                  resolve(result);
              }
          });
        });
      });
    }   
  }
}

function _mapModelNameToFactory(modelName) {
    const modelNames = exports.modelNames;

    switch (modelName) {
        case modelNames.USERS_MODEL:
            return usersQueryFactory;
        case modelNames.VOTATIONS_MODEL:
            return votationsQueryFactory;
        case modelNames.VOTES_MODEL:
            return votesQueryFactory;
    }
}
/*                        
*******************************************************************************/

/*                        /model/users
*******************************************************************************/
// model/users/index.js
exports.constants = {
    CREATE_USER: 'CREATE_USER',
    GET_ALL: 'GET_ALL',
    GET_USER_BY_ID: 'GET_USER_BY_ID',
    GET_USER_BY_EMAIL: 'GET_USER_BY_EMAIL',
    FIND_USER_LIMITED_FROM_OFFSET: 'FIND_USER_LIMITED_FROM_OFFSET', //FULLTEXT (name)
    DELETE_USER_BY_ID: 'DELETE_USER_BY_ID',
    CLEAR_TABLE: 'CLEAR_TABLE',
    DROP_TABLE: 'DROP_TABLE'
}

// model/users/factory.js
const constants = require('./index.js').constants;

module.exports = (query, data) => {
    switch(query) {
        case constants.CREATE_USER:
            return 'INSERT INTO USERS (name, email, password, avatar) VALUES ("'
                 + data.name + '", "' + data.email + '", "'
                 + data.password + '", "' + data.avatar + '");';
        case constants.GET_ALL:
            return 'SELECT * FROM users;';
        case constants.GET_USER_BY_ID:
            return 'SELECT * from users WHERE id = ' + data.id + ';';
        case constants.GET_USER_BY_EMAIL:
            return 'SELECT * from users WHERE email = "' + data.email + '";';
        case constants.FIND_USER_LIMITED_FROM_OFFSET: 
            return 'SELECT * FROM users WHERE MATCH (name) AGAINST ("' + data.name + '") '                 
                 + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
        case constants.DELETE_USER_BY_ID:
            return 'DELETE FROM users WHERE id = ' + id + ';';
        case constants.CLEAR_TABLE:
            return 'DELETE FROM users';
        case constants.DROP_TABLE:
            return 'DELETE FROM users';
        default:
            return '';
    }  
};

/*                        
*******************************************************************************/

/*                        /model/votations
*******************************************************************************/
// model/votations/index.js
exports.constants = {
    CREATE_VOTATION: 'CREATE_VOTATION',
    GET_ALL: 'GET_ALL',
    GET_ALL_LIMITED_FROM_OFFSET: 'GET_ALL_LIMITED_FROM_OFFSET',
    GET_VOTATION_BY_ID: 'GET_VOTATION_BY_ID',
    GET_USER_VOTATIONS: 'GET_USER_VOTATIONS',
    GET_USER_VOTATIONS_LIMITED_FROM_OFFSET: 'GET_USER_VOTATIONS_LIMITED_FROM_OFFSET',
    FIND_VOTATION: 'FIND_VOTATION',
    FIND_VOTATION_LIMITED_FROM_OFFSET: 'FIND_VOTATION_LIMITED_FROM_OFFSET',
    DELETE_VOTATION_BY_ID: 'DELETE_VOTATION_BY_ID',
    CLEAR_TABLE: 'CLEAR_TABLE',
    DROP_TABLE: 'DROP_TABLE'
};

// models/votations/factory.js
const constants = require('./index.js').constants;

// хорошо задокументировать!
module.exports = (query, data) => {
    switch(query) {
        case constants.CREATE_VOTATION:
            return 'INSERT INTO votation (title, description, creator_id) VALUES '
                 + '(' + '"' + data.title + '", "' + data.description + '", "'
                 + data.creator_id + '");';
        case constants.GET_ALL:
            return 'SELECT * FROM votations ORDER BY created_at DESC;';
        case constants.GET_ALL_LIMITED_FROM_OFFSET:
            return 'SELECT * FROM votations LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
        case constants.GET_VOTATION_BY_ID:
            return 'SELECT * FROM votations WHERE votations.id = ' + data.id
                 + ' LEFT JOIN votes ON votations.id = votes.votation_id;';
        case constants.GET_USER_VOTATIONS:
            return 'SELECT * FROM votations WHERE votations.creator_id = ' + data.creatorId
                 + ' LEFT JOIN votes ON votations.id = votes.votation_id;';
        case constants.GET_USER_VOTATIONS_LIMITED_FROM_OFFSET:
            return 'SELECT * FROM votations WHERE votations.creator_id = ' + data.creatorId
                 + ' LEFT JOIN votes ON votations.id = votes.votation_id'
                 + ' ORDER BY created_at DESC'
                 + ' LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
        case constants.FIND_VOTATION:
            return 'SELECT * FROM votations WHERE MATCH (title,description) AGAINST ("' + text + '") '
                 + 'LEFT JOIN votes ON votations.id = votes.votation_id;';
        case constants.FIND_VOTATION_LIMITED_FROM_OFFSET:
            return 'SELECT * FROM votations WHERE MATCH (title,description) AGAINST ("' + text + '") '
                 + 'LEFT JOIN votes ON votations.id = votes.votation_id '
                 + ' ORDER BY created_at DESC'
                 + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
        case constants.DELETE_VOTATION:
            return 'DELETE FROM votations WHERE id = ' + data.id + ';';
        case constants.CLEAR_TABLE:
            return 'DELETE FROM votations;';
        case constants.DROP_TABLE:
            return 'DROP TABLE IF EXISTS votations;';
        default:
            return '';
    }
}
/*                        
*******************************************************************************/

/*                        /model/votes
*******************************************************************************/
// model/votes/index.js
exports.constants = {
    CREATE_VOTE: 'CREATE_VOTE',
};

// models/votations/factory.js
const constants = require('./index.js').constants;

module.exports = (query, data) => {
    switch (query) {
        case constants.CREATE_VOTE:
            return 'INSERT INTO votes (votation_id, creator_id, value) VALUES ("'
                 + data.votation_id + '", "' + data.creator_id + '", "' + data.value + '");';
        default:
            return '';
    }
};

/*                        
*******************************************************************************/

　
/*                        /test/unit/model
*******************************************************************************/
const modelNames = require('./models).modelNames
    , users = require('./models').getModel(modelNames.USERS_MODEL)
    , userConstants = require('./models/users').constants;
 
 users.query(userConstants.CREATE_USER, {...rawData}).then(() => { // dosometh... });

 const chai = require('chai');
     , db   = require('../../../app/db')

     , modelNames = require('./models).modelNames
     , users = require('./models').getModel(modelNames.USERS_MODEL)
     , userConstants = require('./models/users').constants

     , expect = chai.expect;

describe('users model', () => {
    const userData = {
        name: 'user',
        email: 'user@email.com',
        password: 'password'
    };

　
    before((done) => {
        db.init()
        //.then(() => users.dropTable())
        .then(() => done());
    });

    beforeEach((done) => {
        users.clear().then(() => done());
    });

    after((done) => {
        db.closeConnection().then(() => done());
    });

    describe('create', () => {
       it('should create user', (done) => {
           users.query(userConstants.CREATE_USER, userData).then((result) => {
               expect(result.affectedRows).to.equal(1);
               expect(result.serverStatus).to.equal(2);
               done();
           });
       });
    });
});
