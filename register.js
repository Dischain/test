// reducers/RegisterReducer.js
import { 
  CHANGE_REGISTER_FORM, 
  SENDING_REGISTER_REQUEST,
  SET_REGISTER_ERROR,
  SET_REGISTER_FORM_ERROR_MESSAGES
} from '../constants/RegisterConstants.js';

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
  registerError,
  registerFormErrorMessages: []
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
    case SET_REGISTER_FORM_ERROR_MESSAGES:
      return assign({}, state, {
        registerFormErrorMessages: action.newState
      });
      break;
    case SET_REGISTER_ERROR:
      return assign({}, state, {
        registerError: action.newState
      });
    default:
      return state;
  }
}

// actions/RegisterActions.js
import { 
  CHANGE_REGISTER_FORM, 
  SENDING_REGISTER_REQUEST,
  SET_REGISTER_ERROR,
  SET_REGISTER_FORM_ERROR_MESSAGES
} from '../constants/RegisterConstants.js';
import commonErrors from '../constants/CommonConstants.js';
import { API_BASE_PATH } from '../config.js';

export function register(userData) {
  return (dispatch) => {
    dispatch(sendingRegisterRequest(true));

    let isValid;

    _validateRegisterForm(userData, (valid, invalidFields) => {
      if (!valid) {
        dispatch(setRegisterFormErrorMessages(invalidFields));
      }

      isValid = valid;
    });

    if (!isValid) {
      dispatch(sendingRegisterRequest(false));
      return;
    }

    let _status;

    return fetch(API_BASE_PATH + '/register', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email: email, password: password })
    })
    .then((res) => {
      _status = res.status;
      return res.json();
    })
    .then((json) => {
      let data = JSON.parse(json);
      if (_status === 201) {
        browserHistory.push('/login');
      } else if (_status === 409) {
        dispatch(setRegisterError(data.message));
      } else {
        dispatch(setRegisterError(commonErrors.ERROR));
      }
      dispatch(sendingRegisterRequest(false));
    })
    .catch((err) => {
      dispatch(setRegisterError(commonErrors.ERROR));
      dispatch(sendingRegisterRequest(false));
    });
  }
}

_validateRegisterForm(data, cb) {
  const specificValidations = ['email'];
  let invalidFields = [];

  Object.keys(data).forEach((field) => {
    if (data[field].length === 0)
      invalidFields.push({ field: field, info: 'Empty field' });
  });

  if (data.email.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,4}$/i)) {
    invalidFields.push({
      field: 'email',
      info: 'Bad email'
    });
  } 

  if (data.password1.length !== 0 || data.password2.length !== 0) {
    if (data.password1 !== data.password2) {
      invalidFields.push({
        field: 'password2',
        info: 'Password does not match'
      }); 
    }
  }

  cb(invalidFields.length === 0, invalidFields);
}

export function sendingRegisterRequest(sending) {
  return { type: SENDING_REGISTER_REQUEST, sending };
}

export function setRegisterFormErrorMessages(messages) {
  return { type: SET_REGISTER_FORM_ERROR_MESSAGES, messages };
}

export function setRegisterError(message) {
  return { type: SET_REGISTER_ERROR, message };
}

export function changeForm(newState) {
  return { type: CHANGE_REGISTER_FORM, newState };
}