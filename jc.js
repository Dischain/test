const httpServer = require('http').Server
	, ws = require('socket.io')

	, modelNames = require('../model').modelNames
    , votations = require('../model').getModel(modelNames.VOTATIONS_MODEL)
    , votationsConstants = require('../model/votations').constants
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants
    , votes = require('../model').getModel(modelNames.VOTES_MODEL)
    , votesConstants = require('../model/votes').constants;

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
        // ...
        // оповестить создателя об успешном создании комнаты
        socket.emit('VOTATION_CREATED', votationId);
      })
      .catch((err) => {
        socket.emit('VOTATION_CREATATION_ERROR');
      });
    });
  });

  io.of('/votationRoom').on('connection', (socket) => {
    socket.on('join', (votationId) => {
      // если в кэше нет голосования с таким votationId, return
      // ...
      // помещаем пользователя, зашедшего в данное голосование, в кеш
      // ...
      // присоединяем его к комнате
      socket.join(votationId);
      // вытаскиваем всех пользователей, зашедших в эту комнату, из кеша
      // ... -> users
      // обновляем список участников голосования
      socket.emit('UPDATE_PARTICIPANTS', users)
    });

    socket.on('disconnect', (userId, votationId) => {
      // удаляем из кеша пользователя с таким userId
      // ...
      // покидаем комнату с таким votationId
      socket.leave(votationId);
      // оповещаем остальных, что usesrId их покинул
      socket.broadcast.to(votationId).emit('REMOVE_USER', userId);
    });

    socket.on('invite', ({ creatorId, votationId, title, description, users }) => {
      // высылаем голосование от имени создателя, с указанием инфо и id голосования
      // указанным в массиве users пользователям
      users.forEach((user) => {
        socket.broadcast.emit('INVITE_USER', { creatorId, votationId, title, description });
      });      
    });

    socket.on('send_vote', ({ votationCreatorId, creatorId, value }) => {
      // сохранить value в редис до завершения голосования
      // ...
      // посылает окончательный результат голосования на creatorId (можно отпр. только раз)
      socket.broadcast.emit('ADD_VOTE');
    });

    socket.on('save_votation', (votationData) => {
      // вытаскивает временные значения голосов из redis
      // ...
      // и сохраняем готовое голосование с результатами в бд, затираем кеш
      // ...
      // закрываем комнату
      socket.broadcast.to(votationId).emit('CLOSE_VOTATION');
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
