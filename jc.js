// 1. Для IN NATURAL LANGUAGE MODE действует так называемое «50% threshold». 
// Это означает, что если слово встречается более чем в 50% всех просматриваемых полей, 
// то оно не будет учитываться, и поиск по этому слову не даст результатов. 
// 1.1 Если сработает не как планировалось -  удалить FULL TEXT индекс из users (name) и вместо
// полнотекстового поиска применять LIKE '%name%'.
// 2. Удалить ON DELETE CASCADE из votaions для creator_id foreign key (если пользователь удалился,
// результаты его голосования все равно должны сохраниться.
/*                        
*******************************************************************************/

/*                        /model/votations
*******************************************************************************/
// model/votations/index.js
exports.constants = {
    CREATE_VOTATION: 'CREATE_VOTATION',
    GET_ALL: 'GET_ALL',
    GET_VOTATION_BY_ID: 'GET_VOTATION_BY_ID',
    GET_ALL_LIMITED_FROM_OFFSET: 'GET_ALL_LIMITED_FROM_OFFSET',
    FIND_VOTATION_LIMITED_FROM_OFFSET: 'FIND_VOTATION_LIMITED_FROM_OFFSET',
    GET_USER_VOTATIONS_LIMITED_FROM_OFFSET: 'GET_USER_VOTATIONS_LIMITED_FROM_OFFSET',
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
            return 'INSERT INTO votations (title, description, creator_id) VALUES ('
                 + data.title + ', ' + data.description + ', ' + data.creator_id + ');';
        case constants.GET_ALL:
            return 'SELECT * FROM votations ORDER BY created_at DESC;';
        case constants.GET_VOTATION_BY_ID:
            return 'SELECT * FROM votations WHERE votations.id = ' + data.id
                 + ' LEFT JOIN votes ON votations.id = votes.votation_id;';
                 // GROUP BY votations.id
        case constants.GET_ALL_LIMITED_FROM_OFFSET:
            return 'SELECT * FROM votations LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
        case constants.FIND_VOTATION_LIMITED_FROM_OFFSET:
            return 'SELECT * FROM votations WHERE MATCH (title,description) AGAINST (' + text + ') '
                 + 'LEFT JOIN votes ON votations.id = votes.votation_id '
                 + ' ORDER BY created_at DESC '
                 + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
        case constants.GET_USER_VOTATIONS_LIMITED_FROM_OFFSET:
            return 'SELECT * FROM votations WHERE votations.creator_id = ' + data.creatorId
                 + ' LEFT JOIN votes ON votations.id = votes.votation_id'
                 + ' ORDER BY created_at DESC'
                 + ' LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
        case constants.DELETE_VOTATION_BY_ID:
            return 'DELETE FROM votations WHERE id = ' + data.id + ';';
        case constants.CLEAR_TABLE:
            return 'DELETE FROM votations;';
        case constants.DROP_TABLE:
            return 'DROP TABLE IF EXISTS votations;'; // поправить это же у users
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
            return 'INSERT INTO votes (votation_id, creator_id, value) VALUES ('
                 + data.votation_id + ', ' + data.creator_id + ', ' + data.value + ');';
        default:
            return '';
    }
};

/*                        
*******************************************************************************/
