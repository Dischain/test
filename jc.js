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
  io.of('/votations').on('connection', (socket) => {
    soket.on('create', ({ title, description }) => {
      // создаем пустое голосование с названием и описанием, получаем его id
    });
    socket.on('invite', ({ creatorId, votationId, title, description, users }) => {
      // высылаем голосование от имени создателя, с указанием инфо и id голосования
      // указанным в массиве users пользователям
      users.forEach((user) => {
        socket.broadcast.emit('inviteUser', { creatorId, votationId, title, description });
      });      
    });
    socket.on('send_vote', ({ votationCreatorId, creatorId, value }) => {
      // посылает окончательный результат голосования от creatorId (можно отпр. только раз)
      // сохранить value в редис до завершения голосования
    });
    soket.on('save_votation', (votationData) => {
      // вытаскивает временные значения голосов из redis
      // и сохраняем готовое голосование с результатами в бд, затираем кеш      
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
