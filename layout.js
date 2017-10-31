// в SocketClient:
connect(query) {
  let host = this.host + (query ? query : '');
  this.socket = io.connect(host, { transports: ['websocket'] });
  // ...
}

// ./ws/votationSocket.js
import SocketClient from './SocketClient.js';

let socket = new SocketClient('/votations', );

socket.on('VOTATION_CREATED', (votationId) => { //dispatch выставляется в middleware
  socket.dispatch(setNewlyCreatedVotationId(votationId));
});

// ./actions/socketVotationActions.js
import { CREATE_VOTATION, SET_NEWLY_CREATED_VOTATION_ID } from '../constants/socketVotationConstants.js';

let useSocket = true, nsp = 'votations';

export function createVotation(votationData) {
  return {
    useSocket,
    nsp, 
    type: CREATE_VOTATION, 
    promise: (socket) => socket.emit(CREATE_VOTATION, votationData)   
  };
}

export function setNewlyCreatedVotationId(votationId) {
    return {
        type: SET_NEWLY_CREATED_VOTATION_ID,
        votationId
    };
}

// ./actions/socketVotationRoomActions.js
import { JOIN, INVITE, SEND_VOTE, SAVE_VOTATION } from '../constants/socketVotationRoomConstants.js';

let useSocket = true, nsp = 'votationRoom';

// { votationId, userId, cretorId }
export function joinVotation(votationData) {
  return {
    useSocket,
    nsp, 
    type: JOIN, 
    promise: (socket) => socket.emit(JOIN, votationData)   
  };
}

export function inviteToVotation(data) {
  return {
    useSocket,
    nsp, 
    type: INVITE, 
    promise: (socket) => socket.emit(INVITE, votationData)   
  };
}

export function sendVote(data) {
  return {
    useSocket,
    nsp, 
    type: SEND_VOTE, 
    promise: (socket) => socket.emit(SEND_VOTE, votationData)   
  };
}

export function saveVotation(data) {
  return {
    useSocket,
    nsp, 
    type: SAVE_VOTATION, 
    promise: (socket) => socket.emit(SAVE_VOTATION, votationData)   
  };
}

// ./middleware/ws.js
export default function socketMiddleware(sockets) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { useSocket, nsp, type, promise, ...rest } = action;

    let socket = sockets[nsp];

    if (!useSocket) {
      return next(action);
    }

    if (!socket.dispatch) socket.dispatch = dispatch;

    return promise(socket)
      .then((result) => {
        return next({ ...rest, result, type }) // тут включается редьюсер и изменяет состояние
                                               // в соотв. с указанным типом.
      });
  }
}

// in component:
// import { someAction } from socketActions.js;
// ...
// dispatch(someAction(someData));
// ...
// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch: func => dispatch(func),
//     someAction: 
//   };
// }
