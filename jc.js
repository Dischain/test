  'CREATE TABLE IF NOT EXISTS users ('
+ 'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, '
+ 'name VARCHAR(20) NO NULL, '
+ 'email VARCHAR(30) NOT NULL, '
+ 'password VARCHAR NOT NULL, '
+ 'avatar BLOB, '
+ 'created_at DATE CURRENT_DATE NOT NULL, '
+ 'UNIQUE INDEX (email) '
+ 'INDEX (password)'
+ ');';

  'CREATE TABLE IF NOT EXISTS votations ('
+ 'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, '
+ 'title TEXT NOT NULL, '
+ 'description TEXT NOT NULL, '
+ 'creator_id INT NOT NULL, '
+ 'created_at DATE CURRENT_DATE NOT NULL, '
+ 'FULLTEXT (title, description), '
+ 'FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE'
+ 'INDEX (creator_id)'
+ ');';

  'CREATE TABLE IF NOT EXISTS votes ('
+ 'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, '
+ 'votation_id INT NOT NULL, ' //constraint
+ 'creator_id INT NOT NULL, '
+ 'value ENUM ("1/2", "1", "2", "5", "8", "13", "20", "40", "100", "?", "inf"), '
+ 'INDEX (votation_id, creator_id)'
+ 'FOREIGN KEY (votation_id) REFERENCES users(id) ON DELETE CASCADE'
+ ');';

// models/users.js
function createUser(userData) {
  let INSERT_USER = 'INSERT name, email, password, avatar INTO users VALUES ()'
  db.query()
}

function getAll() {}

function getAllWithLimit(first, last) {}

function getUser(id) {}

function deleteUser(id) {}

function dropTable(){}

// models/votations.js
function createVotation(votationData) {}

function getAll() {}

function getAllWithLimit(first, last) {}

function getVotation(id) { /*with votes*/}

function getUserVotations() {}

function findVotation(text) {}

function deleteVotation(id) {}

function dropTable() {}

// models/votes.js
function createVote(voteData) {}
