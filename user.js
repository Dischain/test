// ./ws/votationSocket.js
import SocketClient from './SocketClient.js';

let socket = new SocketClient('/votations', );

socket.on('VOTATION_CREATED', (votationId) => {
  socket.dispatch(setNewlyCreatedVotationId(votationId));
});

// ./actions/socketVotationActions.js
import { 
  CREATE_VOTATION, 
  SET_CURRENT_VOTATION_ID 
} from '../constants/socketVotationConstants.js';

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
    type: SET_CURRENT_VOTATION_ID,
    votationId
  };
}

// .reducers/socketVotationReducer.js <-------------------new
const initialState = {
  currentVotationId: '',
  currentVotationTitle: '',
  currentVotationDescription: ''
}

export default function socketVotationReducer(state = initialState, action) {
  switch(action.type) {
    case SET_CURRENT_VOTATION_ID:
      return assign({}, state, {
        currentVotationId: action.votationId
      });
    default:
      return state;
  }
}

// .ws/votationRoomSocket.js <-------------new
import SocketClient from './SocketClient.js';

let socket = new SocketClient('/votationRoom');

socket.on('UPDATE_PARTICIPANTS', (users) => {
  socket.dispatch(updateParticipants(users));
});

socket.on('INVITE_USER', (data) => {
  socket.dispatch(enterVotation(data));
});

socket.on('REMOVE_USER', (userId) => {
  socket.dispatch(removeUser(userId));
});

socket.on('ADD_VOTE', (data) => {
  socket.dispatch(addVote(data));
});

socket.on('CLOSE_VOTATION', (id) => {
  socket.dispatch(closeVotation(id));
});

// ./actions/socketVotationRoomActions.js <-----------------new
import {
  JOIN, 
  INVITE, 
  SEND_VOTE, 
  SAVE_VOTATION,

  UPDATE_PARTICIPANTS, 
  ADD_USER,
  REMOVE_USER,
  ADD_VOTE,
  CLOSE_VOTATION
} from '../constants/socketVotationRoomConstants.js';

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

export function updateParticipants(users) {
  return { type: UPDATE_PARTICIPANTS, users };
}

export function enterVotation(data) {
  return { type: ADD_USER, data };
}

export function removeUser(userId) {
  return { type: REMOVE_USER, userId };
}

export function addVote(data) {
  return { type: ADD_VOTE, data };
}

export function closeVotation(id) {
  return {
    type: CLOSE_VOTATION, id };
}

// .reducers/socketVotationRoomReducer.js <-------------------new
const initialState = {
  currentVotationParticipants: [],
  currentVotationVotes: [],
  updateVotationList: false,

  currentInviteData: {
    creatorId: '',
    title: '',
    description: ''
  }
}

export default function socketVotationReducer(state = initialState, action) {
  switch(action.type) {
    case UPDATE_PARTICIPANTS:
      return assign({}, state, {
        currentVotationParticipants: action.users
      });
    case ADD_USER: {
      let temp = state.currentVotationParticipants;
      let { user, votationId, ...restInviteData } = action.data;
      temp.push(user);

      return assign({}, state, {
        currentVotationParticipants:  temp,
        currentInviteData: restInviteData
      });
    }
    case REMOVE_USER: {
      let temp = state.currentVotationParticipants;
      let indexToRemove = temp.reduce((initial, id, index) => {
        if (id === action.userId) return initial = index;
	    else return initial;
      }, null);
      temp.splice(indexToRemove, 1);

      return assign({}, srtate, {
          currentVotationParticipants: temp;
      });
    }
    case ADD_VOTE: {
      let temp = state.currentVotationVotes;
      
      temp.push(action.voteData);

      return assign({}, state, {
        currentVotationVotes: temp
      });
    }
    case CLOSE_VOTATION: {
        return assign({}, state, {
          updateVotationList: true,
          currentVotationId: '',
          currentVotationParticipants: [],
          currentVotationVotes: [],  
        });
    }
    default:
      return state;
  }
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

　
