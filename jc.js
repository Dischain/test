const httpServer = require('http').Server
	, ws = require('socket.io')

	, modelNames = require('../model').modelNames
    , votations = require('../model').getModel(modelNames.VOTATIONS_MODEL)
    , votationsConstants = require('../model/votations').constants
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants
    , votes = require('../model').getModel(modelNames.VOTES_MODEL)
    , votesConstants = require('../model/votes').constants

    , cache = require('../cache').votationCache

    , assign = Object.assign;

function ioEvents(io) {
  io.on('connection', (socket) => {
    // обновить список юзеров онлайн
    // поместить в кеш, что юзер онлайн
  });
  io.on('disconnect', (socket) => {
    // обновить список юзеров онлайн
    // поместить в кеш, что юзер офлайн
  });
  io.of('/votations').on('connection', (socket) => {
    socket.on('CREATE_VOTATION', (votationData) => {
      votations.query(votationsConstants.CREATE_VOTATION, votationData)
      .then((votationId) => {
        // сохранить id временного голосования
        cache.storeVotation(assign({}, votationData, { id: votationId }))
        .then(() => {
          // оповестить создателя об успешном создании комнаты
          socket.emit('VOTATION_CREATED', votationId);
        })
        .catch((err) => {
          socket.emit('VOTATION_CREATATION_ERROR');
        })        
      })
      .catch((err) => {
        socket.emit('VOTATION_CREATATION_ERROR');
      });
    });
  });

  io.of('/votationRoom').on('connection', (socket) => {
    socket.on('join', (votationId, userId) => {
      // если в кэше нет голосования с таким votationId, return
      return cache.containsVotation(votationId)
      .then((contains) => {
        if (!contains) return throw new Error('VOTATION_NOT_EXISTS');
        return Promise.resolve();        
      })
      .then(() => {
        // помещаем пользователя, зашедшего в данное голосование, в кеш
        return cache.storeUserByVotation(votationId, userId);
      })
      .then(() => {
        // присоединяем его к комнате
        return new Promise((resolve, reject) => {
          socket.join(votationId, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      })
      // вытаскиваем всех пользователей, зашедших в эту комнату, из кеша
      .then(() => return getusersByVotation(votationId))
      // обновляем список участников голосования
      .then((users) => {
        socket.to(votationId).emit('UPDATE_PARTICIPANTS', users)
      })
      .catch((err) => {
        if (err.message === 'VOTATION_NOT_EXISTS')
          socket.emit('VOTATION_CONNECTION_ERROR');
      });
    });

    socket.on('disconnect', (userId, votationId) => {
      // удаляем из кеша пользователя с таким userId
      cache.removeUserFromVotation(userId, votationId)
      .then(() => {
        // покидаем комнату с таким votationId
        return new Promise((resolve, reject) => {
          socket.leave(votationId, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      })
      .then(() => {
        // оповещаем остальных, что usesrId их покинул
        socket.to(votationId).emit('REMOVE_USER', userId);
      })
      .catch((err) => {
        socket.emit('VOTATION_DISCONNECTION_ERROR');
      });
    });

    socket.on('invite', ({ creatorId, votationId, title, description, users }) => {
      // высылаем голосование от имени создателя, с указанием инфо и id голосования
      // указанным в массиве users пользователям
      users.forEach((user) => {
        socket.to(votationId).emit('INVITE_USER', { creatorId, votationId, title, description });
      });
    });

    // voteData должен иметь поле creatorId (своего id пока еще не имеет). Учесть это в cache.storeVote
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
      // ...
      // и сохраняем готовое голосование с результатами в бд, затираем кеш
      // ...
      // закрываем комнату
      socket.broadcast.to(votationId).emit('CLOSE_VOTATION');
      // чистим кеш
    });
  });
}

module.exports = (app) => {
  let server = Server(app)
    , io = ws(server);

  io.set('transports', ['websocket']);

  ioEvents(io);

  return server;
}

// client/app.js
const createStoreWithMiddleware = applyMiddleware(
  thunk,
  socketMiddleware({
    'votations': votationsSocket, // настраиваются в другом месте
    'votationRoom': new SocketClient('/votationRoom'),
    'root': new SocketClient('/')
  }))
  (createStore);

// client/actions/votationActions.js
// вызывается после заполнения всех полей формы
export function create(votationData) {
  return { 
    useSocket: true,
    nsp: 'votations', 
    type: CREATE_VOTATION, 
    promise: (socket) => socket.emit(CREATE_VOTATION, votationData)
  };
}

export default function socketMiddleware(sockets) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { useSocket, nsp, type, promise, ...rest } = action;

    let socket = sockets[nsp];

    if (!useSocket || !promise) {
      return next();
    }

    return promise(socket)
      .then((result) => {
        return next({ ...rest, result, type })
      });
  }
}

import io from 'socket.io-client';

export default class SocketClient {
  constructor(nsp, host = config.host, userId) {
    this.nsp = nsp;
    this.host = host;
    this.userId = userId;
  }

  connect() {
    this.socket = io(nsp, host, { transports: ['websocket'] });

    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => resolve());
      this.socket.on('connect_error', (error) => reject(error));
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.socket.disconnect(() => { // как передать данные при дисконнекте?
        this.socket = null;
        resolve();
      });
    });
  }

  emit(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      return this.socket.emit(event, data, (response) => {
        if (response.error) {
          return reject(response.error);
        }

        return resolve();
      });
    });
  }

  on(event, fun) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      this.socket.on(event, fun);
      resolve();
    });
  }
}

// votationsSocket.js
let socket = new SocketClient('/votations');

socket.connect().then(() => {
  socket.on('VOTATION_CREATED', votationId => {
    // и перемещаемся по адресу /votations/id
    // после перехода на страницу с голосованием на клиенте происходит переход
    dispatch(joinVotation(votationId)); // вызывается экшн из votationRoomSocket.js
  });
});

export default votationSocket;
