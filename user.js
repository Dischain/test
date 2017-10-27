'use strict';

const chai = require('chai')
    , io = require('socket.io-client')
    , expect = chai.expect
    , flush = require('../../app/cache').flush
    , cache = require('../../app/cache').votationCache

    , modelNames = require('../../../app/model').modelNames
    , votations = require('../../../app/model').getModel(modelNames.VOTATIONS_MODEL)
    , votationConstants = require('../../../app/model/votations').constants;

describe('websocket server', () => {
  describe('votations namespace', () => {
    const votation1 = {
      title: 'test title',
      description: 'test desc',
      creator_id: '1'
    };

    it('should create votation', (done) => {
      const client1 = io.connect(
        'http://localhost:3001/votations',
        { transports: ['websocket'] });

      client1.on('connect', () => {
        client1.emit('CREATE_VOTATION', votation1);

        client1.on('VOTATION_CREATED', (votationId) => {
          expect(votationId).to.be.a('number');
          done();
        });
      });
    });
  });

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

    after((done) => {
      flush().then(done);
    });

    it('should UPDATE_PARTICIPANTS after joininig votation '
    + 'room', (done) => {       
      client1 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true
        });

      client2 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id });

        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id });
        });           
      });
      client1.on('UPDATE_PARTICIPANTS', (users) => {
        expect(users.length).to.be.equal(2);
        client1.disconnect();
        client2.disconnect();
        done();
      });
    });

    // 1. попробовать клиент2 подсоединить к комнате namespace`у votationRoom
    // 2. добавить force new connection
    // 3. не забывать выполнять дисконнект
    it('should invite user', (done) => {
      client1 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      
      client2 = io.connect(
        'http://localhost:3001/',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id });
        client1.emit('invite', { 
          creatorId: user1.id,
          votationId,
          title: votation1.title,
          description: votation1.description,
          users: [2]
        });

      });
      client2.on('invite', (data) => {
        console.log(data);
        client1.disconnect();
        client2.disconnect();
        done();
      })
    });

    it('should trigger REMOVE_USER after disconnect', (done) => {
      client1 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client2 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id });

        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id });
          client2.disconnect();
        });           
      });
      client1.on('REMOVE_USER', (userId) => {
        console.log(userId);
        expect(userId).to.be.equal(user2.id);
        client1.disconnect();
        done();
      });
    });

    it('should send vote to votation creator', (done) => {
      client1 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client2 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id });

        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id });
          client2.emit('send_vote', { value: '1', creatorId: '2', votationId});          
        });
      });

      client1.on('ADD_VOTE', (voteData) => {
        console.log(voteData);
        client1.disconnect();
        client2.disconnect();
        done();
      });
    });
  });

  describe('save votation', () => {
    const     
    vote1 = { value: '1', creatorId: '1' },
    vote2 = { value: '1', creatorId: '2' };
    let
    client1, client1, 
    votation1 = { title: 'test title', description: 'test desc', creator_id: '1' },
    votationId;

    before((done) => {
      flush()
      .then(() => votations.query(votationConstants.CREATE_TABLE))
      .then(() => cache.storeVote(vote1))
      .then(() => cache.storeVote(vote2))
      .then(() => votations.query(votationConstants.CREATE_VOTATION, votation1))
      .then(({ insertId }) => { votationId = insertId; votation1.id = insertId; return Promise.resolve(); })
      .then(() => cache.storeVoteByVotation(votationId, vote1.creatorId))
      .then(() => cache.storeVoteByVotation(votationId, vote2.creatorId))
      .then(() => {
        client1 = io.connect(
          'http://localhost:3001/votationsRoom',
          { 
            transports: ['websocket'],
            'force new connection': true
          });
        client2 = io.connect(
          'http://localhost:3001/votationsRoom',
          { 
            transports: ['websocket'],
            'force new connection': true
          });
        
        client1.on('connect', () => {
          client1.emit('join', { votationId, userId: user1.id });
          client1.emit('save_votation', votation1);
        });
      });
    });

    it('should save votation', (done) => {
      client1.on('CLOSE_VOTATION', (success) => {
        expect(success).to.be.equal(true);
        done();
      }); // сервер должен передать true (сейчас он ничего не передает)
    });
  });
});
