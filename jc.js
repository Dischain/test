// сначала протестировать endpoints на корректный возврат ошибок авторизации
// найти токен после логина

//actions/AppActions.js
import { CHANGE_FORM, SENDING_REQUEST, SET_ERROR_MESSAGE } from '../constants/AppConstants';

export function sendingRequest(sending) {
  return { type: SENDING_REQUEST, sending };
}

export function setErrorMessage(message) {
  return { type: SET_ERROR_MESSAGE, message};
}

// utils/validateForm.js
// utils/auth.js
import { API_BASE_PATH } from '../constants/AppConstants';

const authErrors = {
  INVALID_EMAIL: 'invalid email',
  INVALID_PASSWORD: 'invalid password'
};

export authErrors;

export default auth = {
  login: (email, password) => {
    if (this.loggedIn())
      return Promise.resolve(true);

    return fetch(API_BASE_PATH + '/login', {
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
      if (res.status === 200) {
          return res.json();
      } else {
          // проверить, куда сообщения попадают при 401
      }
    })
    .then((json) => { // { name: user.name, email: user.email, avatar: user.avatar, userId: user.id };
        let user = JSON.parse(json);
        sessionStorage.setItem('token', /*res должен передать токен*/)
        return Promise.resolve(user);
    })
    .catch((err) => {
        throw err;
    });
  }
}

// actions/AuthActions.js
'use strict';
import { browserHistory } from 'react-router';
import { sendingRequest, setErrorMessage } from './AppActions.js';
import auth, { authErrors } from '../utils/auth.js';

// валидацию форм выполнять до отправки запроса
export function login(email, password) {
  return (discpatch) => {
    discpatch(sendingRequest(true));
    
    auth.login(email, password)
    .then((user) => {
      dispatch(sendingRequest(false));

      if (user) {
          browserHistory.push('/dashboard');
      }
    })
    .catch((err) => discpatch(setErrorMessage(err.message)) );
  }
}
