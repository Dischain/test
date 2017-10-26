 /*                     Votes - Votations
  ***************************************************************/
    storeVote: function(voteData) {
      const key = 'vote:' + voteData.creator_id; // <---------
      return new Promise((resolve, reject) => {
        con.hmset(key, voteData, (err) => {
          if (err) return reject(err);
          return resolve();
        });
      });      
    },

    getVote: function(creator_id) {
      const key = 'vote:' + creator_id;
      return new Promise((resolve, reject) => {
        con.hgetall(key, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });  
    },

    removeVote: function(creator_id, fields) {
      const key = 'vote:' + creator_id;
      return new Promise((resolve, reject) => {
        con.hdel(key, fields, (err, numDeleted) => {
          if (err) return reject(err);
          return resolve(numDeleted);
        });
      });
    },

    storeVoteByVotation: function(votationId, voteId) {
      const key = 'votation:' + votationId + ':votes';
      return new Promise((resolve, reject) => {        
        con.sadd(key, voteId, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    },    

    getVotesByVotation: function(votationId) {
      const key = 'votation:' + votationId + ':votes';
      return new Promise((resolve, reject) => {
        con.smembers(key, (err, res) => {
          if (err) return reject(err);
          
          let votes = [];

          res.reduce((init, creator_id) => {
            return init.then(() => {
              return this.getVote(creator_id).then((res) => {
                votes.push(res);
                return Promise.resolve();              
              });
            })            
          }, Promise.resolve())
          .then(() => {
            return resolve(votes);
          })          
        });
      });
    },   
    
    removeAllVotesByVotation: function(votationId) {
      const key = 'votation:' + votationId + ':votes';
      return new Promise((resolve, reject) => {
        con.smembers(key, (err, res) => {
          if (err) return reject(err);
          
          res.reduce((init, creator_id) => {
            return init.then(() => this.removeVote(creator_id, Object.keys({ value, creator_id, votation_id})))            
          }, Promise.resolve())
          .then(() => {
            return resolve(votes);
          })          
        });
      });
    },

    removeVoteByVotation: function(votationId, voteId) {
      const key = 'votation:' + votationId + ':votes';
      return new Promise((resolve, reject) => {
        con.srem(key, voteId, (err, numRemoved) => {
          if (err) return reject(err);
          return resolve(numRemoved);
        });
      });
    }
/*************************************************************************/

      // как отправить сообщение конкретному сокету?
      // vote должен храниться по id создателя, а не голосования, т.к. своего айди покa не имеет
      socket.on('send_vote', (voteData) => {
        // сохранить value в редис до завершения голосования
        cache.storeVote(voteData)
        // привяжем голос к голосованию
        .then(() => cache.storeVoteByVotation(vote.votationId, vote.creatorId))
        // посылает окончательный результат голосования на creatorId (можно отпр. только раз)
        .then(() => socket.to(voteData.votationId).emit('ADD_VOTE', voteData));
      });
  
      socket.on('save_votation', (votationData) => {
        // вытаскивает временные значения голосов из redis
        cache.getVotesByVotation(votationData.id)
        .then((votes) => {
        // и сохраняем готовое голосование с результатами в бд
          return votesData.reduce((initial, vote) => {
            vote.votation_id = votationData.id;
            return initial.then(() => votes.query(votesConstants.CREATE_VOTE, vote));
          }, Promise.resolve());
        })
        // затираем кеш
        .then(() => cache.removeVotation(votationData.id, Object.keys(votationData))
        .then(() => cache.removeAllVotesByVotation(votationData.id)) // дописать
        .then(() => cache.removeAllUserFromVotation(votationData.id)) // дописать
        .then(() => {
        // закрываем комнату
          socket.broadcast.to(votationId).emit('CLOSE_VOTATION');
        })
        .catch((err) => {          
          votations.query(votationsConstants.DELETE_VOTATION, votationData.id)
          .then(() => socket.emit('VOTATION_SAVING_ERROR'))          
        })
      });
    });

// после успешного создания комнаты клиент должен перейти в соотв. пространство имен

describe('votationRoom namespace', () => {
    const 
    votation1 = {
      title: 'test title',
      description: 'test desc',
      creator_id: '1'
    },
    user1 = {
      name: 'user1',
      id: '1'
    }, 
    user2 = {
      name: 'user2',
      id: '2'
    };
    let client1, client2, votationId;
    // before:
    // 1. Создать объект голосования и поместить его в редис
    // 2. Создать объект юзера
    // socket.emit('join', roomId);
    before((done) => {
      client1 = io.connect(
        'http://localhost:3001/votations',
        { transports: ['websocket'] });
      client1.on('connect', () => {
        client1.emit('CREATE_VOTATION', votation1);

        client1.on('VOTATION_CREATED', (id) => {
          votationId = id;          
          done();
        });
     });
    });

    after(() => {
      flush().then(done);
    });

    it('should update list of participants after joininig votation room', (done) => {       
      client1 = io.connect(
        'http://localhost:3001/votationRoom',
        { transports: ['websocket'] }),

      client1.on('connect', () => {
        client1.on('UPDATE_PARTICIPANTS', (users) => {
          console.log(users);
          done();
        });
        
        client1.emit('join', votationId);
      });
    });
  });
