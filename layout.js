// создать отдельные редьюсеры для authReducer, usersReducer, votationsReducer, currentVotationReducer
// и для каждого из них прописать initialState

　
　
// reducers/loginReducer.js
import { 
  SET_AUTH, 
  CHANGE_LOGIN_FORM, 
  SENDING_LOGIN_REQUEST,
  SET_LOGIN_ERROR_MESSAGE
} from '../constants/LoginConstants.js';

import auth from '../utils/auth';

const assign = Object.assign;

const initialState = {
  loginFormState: {
    email: '',
    password: ''
  },
  sendingLoginRequest: false,
  loginFormErrorMessage: '',
  loggedIn: auth.loggedIn()
};

export function loginReducer(state = initialState, action) {
  switch(action.type) {
    case SET_AUTH: 
      return assi({}, state, {
        loggedIn: action.newState
      });
      break;
    case CHANGE_LOGIN_FORM:
      return assign({}, state, {
        loginFormState: action.newState
      });
      break;
    case SENDING_LOGIN_REQUEST:
      return assign({}, state, {
        sendingLoginRequest: action.newState
      });
      break;
    case SET_LOGIN_ERROR_MESSAGE:
      return assign({}, state, {
        loginFormErrorMessage: action.newState
      });
      break;
    default:
      return state;
  }
}

// reducers/AuthReducer.js
import { 
  CHANGE_REGISTER_FORM, 
  SENDING_REGISTER_REQUEST,
  SET_REGISTER_ERROR_MESSAGE
} from '../constants/RegisterConstants.js';

import auth from '../utils/auth';

const assign = Object.assign;

const initialState = {
  registerFormState: {
    name: '',
    email: '',
    password1; '',
    password2: '',
    avatar: ''
  },
  sendingRegisterRequest: false,
  registerFormErrorMessage: ''
};

export function registerReducer(state = initialState, action) {
  switch(action.type) {
    case CHANGE_REGISTER_FORM:
      return assign({}, state, {
        registerFormState: action.newState
      });
      break;
    case SENDING_REGISTER_REQUEST:
      return assign({}, state, {
        sendingRegisterRequest: action.newState
      });
      break;
    case SET_REGISTER_ERROR_MESSAGE:
      return assign({}, state, {
        registerFormErrorMessage: action.newState
      });
      break;
    default:
      return state;
  }
}

// actions/loginActions.js
import { 
  SET_AUTH, 
  CHANGE_LOGIN_FORM, 
  SENDING_LOGIN_REQUEST,
  SET_LOGIN_ERROR_MESSAGE
} from '../constants/LoginConstants.js';

import auth from '../utils/auth';

export function login(email, password) {
  
}
