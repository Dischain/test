const mysql = require('mysql');
const config = require('../config');
const constants = reqire('../constants');
const tablesSchemas = require('./schemas.js');

// constants = {
//     MODE_PRODUCTION: 'MODE_PRODUCTION',
//     MODE_DEV: 'MODE_DEV',
//     READ: 'READ*',
//     WRITE: 'WRITE'
// };

let state = {
  pool: null,
  mode: null,
}

exports.init = function(mode) {
  return new Promise((resolve, reject) => {
    if (mode === constants.MODE_PRODUCTION) {
      state.pool = mysql.createPoolCluster();

      state.pool.add('WRITE', {
        host: '192.168.0.5',
        user: 'your_user',
        password: 'some_secret',
        database: config.PRODUCTION_DB
      })

      state.pool.add('READ1', {
        host: '192.168.0.6',
        user: 'your_user',
        password: 'some_secret',
        database: config.PRODUCTION_DB
      })

      state.pool.add('READ2', {
        host: '192.168.0.7',
        user: 'your_user',
        password: 'some_secret',
        database: config.PRODUCTION_DB
      })
    } else {
      state.pool = mysql.createPool({
        host: 'localhost',
        user: 'your_user',
        password: 'some_secret',
        database: config.TEST_DB
      })
    }

    state.mode = mode
    
    if (!state.pool) return reject(new Error('Missing database connection!'))
    
    Promise.all(tablesSchemas.map((schema) => {
      return _createTable(schema);
    })).then(() => resolve());
  });
}

exports.getConnection = function(type) {
  const pool = state.pool

  return new Promise((resolve, reject) => {
    if (type === constants.WRITE) {
      pool.getConnection(constants.WRITE, (err, connection) => {
        if (err) return reject(err);

        resolve(connection);
      });
    } else if (type === constants.READ) {
      pool.getConnection(constants.READ, (err, connection) => {
        if (err) return reject(err);
        resolve(connection);
      });
    } else {
      pool.getConnection((err, connection) => {
        if (err) return reject(err);
        resolve(connection);
      });
    }
  });
}

exports.clear = function(tables, done) {
  if (Array.isArray(tables)) {
    return Promise.all(tables.map((table) => {
      return _clearTable(table);
    }));
  } else {
    return _clearTable(tables);
  }
}

/*                      Helper functions
*******************************************************************/

function _createTable(query) {
  const pool = state.pool;

  return new Promise((resolve, reject) => {
    pool.query(query, (err) => {
      if (err) return reject(err);
      resolve();
    });
  })
}

function _clearTable(table) {
  const pool = state.pool;
  
  return new Promise((resolve, reject) => {
    pool.query('DELETE * FROM ' + table, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

//app.js:
db.init(config.MODE_PRODUCTION)
  .then(() => {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    });
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  });
