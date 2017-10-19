//LoginPage.js
'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ControlledInput from '../ControlledInput.js';
import LoadingButton from '../LoadingButton.js';
import {
  login,
  changeForm,
  setLoginFormIsValid,
  setLoginFormErrorMessages
} from '../../actions/loginActions.js';

const assign = Object.assign;

// TODO: create separete container component for submit btn
export default class LoginPage extends Component {
  render() {
    let submitBtn;

    if (!this.props.isLoginFormValid) {
      submitBtn = 
      <button className = 'form__submit-btn' type = 'submit'>Login</button>
    } else if (this.props.sendingLoginRequest) {
      submitBtn = <LoadingButton btnText = {'Login'}/>
    } else {
      submitBtn = 
      <button className="form__submit-btn form__submit-btn_active" type="submit">Login</button>
    }

    return (
      <div className = 'form-page__wrapper'>        
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Register</h2>
          </div>

          <form className = 'form' onSubmit = {this._onSubmit.bind(this)}>
            <ControlledInput formId = {'email'}
              fieldName = {'Email'}
              type = {'text'}
              value = {this.props.loginFormState.email}
              placeholder = {'Enter Your Email'}
              onChange = {this._onChangeEmail.bind(this)}
              errorMessage = {this.props.loginFormErrorMessages.email}
            />
            <ControlledInput formId = {'password'}
              fieldName = {'Password'}
              type = {'password'}
              value = {this.props.loginFormState.password} 
              onChange = {this._onChangePassword.bind(this)}
              errorMessage = {this.props.loginFormErrorMessages.password}
            />
            <div className = 'form__submit-btn-wrapper'>
              {submitBtn}
            </div>
          </form>          
          
          <div className='form-page__form-footer'>
            <div className='form-page__form-error'>{this.props.loginError}</div>
          </div>
        </div>
      </div>
    );
  }

  _onSubmit(event) {
    event.preventDefault();

    if (this.props.isLoginFormValid) {
      this.props.login({
        email: this.props.loginFormState.email,
        password: this.props.loginFormState.password,        
      });
    }
  }

  _onChangeEmail(event) {
    let value = event.target.value;
    let newState = assign(this.props.loginFormState, {
      email: value
    });
    let errorMsgs = assign({}, this.props.loginFormErrorMessages);

    this.props.dispatch(changeForm(newState));

    if (!value.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,4}$/i)) {
      errorMsgs.email = 'Invalid email';
      this.props.dispatch(setLoginFormIsValid(false));      
    } else if (value.length === 0) {
      errorMsgs.email = 'Empty field';
      this.props.dispatch(setLoginFormIsValid(false)); 
    } else {
      errorMsgs.email = '';
      this.props.dispatch(setLoginFormIsValid(true));
    }

    this.props.dispatch(setLoginFormErrorMessages(errorMsgs));
  }

  _onChangePassword(event) {
    let value = event.target.value;
    let newState = assign(this.props.loginFormState, {
      password: value
    });
    let errorMsgs = assign({}, this.props.loginFormErrorMessages);

    this.props.dispatch(changeForm(newState));

    if (value.length === 0) {
      errorMsgs.password = 'Empty field';
      this.props.dispatch(setLoginFormIsValid(false)); 
    } else {
      errorMsgs.password = '';
      this.props.dispatch(setLoginFormIsValid(true));
    }

    this.props.dispatch(setLoginFormErrorMessages(errorMsgs));
  }
}

function mapStateToProps({ loginReducer }) {
  return {
    loginFormState: loginReducer.loginFormState,
    sendingLoginRequest: loginReducer.sendingLoginRequest,
    loginError: loginReducer.loginError,
    isLoginFormValid: loginReducer.isLoginFormValid,    
    loginFormErrorMessages: loginReducer.loginFormErrorMessages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    login: userData => dispatch(login(userData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);

//loginActions.js
'use strict';

import { 
  SET_AUTH, 
  CHANGE_LOGIN_FORM, 
  SENDING_LOGIN_REQUEST,
  SENDING_LOGOUT_REQUEST,
  SET_LOGIN_ERROR,
  SET_LOGIN_FORM_VALID,
  SET_LOGIN_FORM_ERROR_MESSAGES,  
} from '../constants/loginConstants.js';
import commonErrors from '../constants/commonConstants.js';
import { API_BASE_PATH } from '../../config.js';
import { setUser, removeUser } from './userActions.js';
import { browserHistory } from 'react-router';

export function login({ email, password }) {
  return (dispatch) => {
    dispatch(sendingLoginRequest(true));

    let { isLoginFormValid } = getState().loginReducer;

    if (!isLoginFormValid) {
      dispatch(sendingLoginRequest(false));
      return;
    }

    let _status;

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
      _status = res.status;
      return res.json();
    })
    .then((json) => { 
        let data = JSON.parse(json);

        if (_status === 200) {
          dispatch(setUser(data));
          dispatch(setAuthState(true));
          browserHistory.push('/dashboard');
          dispatch(changeForm({ email: '', email: '' }));
        } else if (_status === 400) {
          dispatch(setLoginError(data.message));
        } else {
          dispatch(setLoginError(commonErrors.ERROR));
        }
        dispatch(sendingLoginRequest(false));
    })
    .catch((err) => {
        dispatch(setLoginError(commonErrors.ERROR));
        dispatch(sendingLoginRequest(false));
    });
  }
}

export function logout() {
  return (dispatch) => {
    dispatch(sendingLogoutRequest(true));
    return fetch(API_BASE_PATH + '/logout', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch(sendingLogoutRequest(false));
        dispatch(setAuthState(false));
        dispatch(removeUser());
        browserHistory.replace(null, '/');
      } else {
        // ?
      }
    })
  }
}

export function sendingLoginRequest(sending) {
  return { type: SENDING_LOGIN_REQUEST, sending };
}

export function sendingLogoutRequest(sending) {
  return { type: SENDING_LOGOUT_REQUEST, sending };
}

export function setAuthState(authState) {
  return { type: SET_AUTH, authState };
}

export function setLoginFormErrorMessages(message) {
  return { type: SET_LOGIN_FORM_ERROR_MESSAGES, message };
}

export function setLoginError(message) {
  return { type: SET_LOGIN_ERROR, message };
}

export function setLoginFormIsValid(valid) {
  return { type: SET_LOGIN_FORM_VALID, valid };
}

export function changeForm(newState) {
  return { type: CHANGE_LOGIN_FORM, newState };
}

//loginReducer.js
import { 
  SET_AUTH, 
  CHANGE_LOGIN_FORM, 
  SENDING_LOGIN_REQUEST,
  SENDING_LOGOUT_REQUEST,
  SET_LOGIN_ERROR,
  SET_LOGIN_FORM_VALID,
  SET_LOGIN_FORM_ERROR_MESSAGES
} from '../constants/loginConstants.js';

const assign = Object.assign;

const initialState = {
  loginFormState: {
    email: '',
    password: ''
  },
  sendingLoginRequest: false,
  sendingLogoutRequest: false,
  loginFormErrorMessages: {
    email: '',
    password: ''
  },
  loginError: '',
  isLoginFormValid: false,
  loggedIn: false
};

export default function loginReducer(state = initialState, action) {
  switch(action.type) {
    case SET_AUTH: 
      return assign({}, state, {
        loggedIn: action.authState
      });
      break;
    case CHANGE_LOGIN_FORM:
      return assign({}, state, {
        loginFormState: action.newState
      });
      break;
    case SENDING_LOGIN_REQUEST:
      return assign({}, state, {
        sendingLoginRequest: action.sending
      });
      break;
    case SENDING_LOGOUT_REQUEST:
      return assign({}, state, {
        sendingLogoutRequest: action.sending
      });
      break;
    case SET_LOGIN_FORM_ERROR_MESSAGES:
      return assign({}, state, {
        loginFormErrorMessages: action.message
      });
      break;
    case SET_LOGIN_FORM_VALID:
      return assign({}, state, {
        isLoginFormValid: action.valid
      });
      break;
    case SET_LOGIN_ERROR:
      return assign({}, state, {
        loginError: action.message
      });
      break;
    default:
      return state;
  }
}

// Nav.js
import React, { Component } from 'react';
import { Link } from 'react-router';
import LoadingButton from '../LoadingButton.js';
import PropTypes from 'prop-types';
import { logout } from '../actions/loginActions';

export default class Nav extends Component {
  render() {
    const navBtns = this.props.loggedIn ? (
      <div>
        <Link to="/dashboard" className="btn btn--dash btn--nav">Dashboard</Link>
        {this.props.sendingLogoutRequest ? (
          <LoadingButton className='btn--nav' btnText = {'Login'}/>
        ) : (
          <a href="#" 
            className="btn btn--login btn--nav" 
            onClick={this._logout.bind(this)}>Logout
          </a>
        )}
      </div>
    ) : (
      <div>
        <Link to="/register" className="btn btn--login btn--nav">Register</Link>
        <Link to="/login" className="btn btn--login btn--nav">Login</Link>
      </div>
    );
    return (
      <div className = 'nav'>
        Navbar {this.props.loggedIn}
      </div>
    );
  }

  _logout() {
    this.props.logout();
  }
}

function mapStateToProps({ loginReducer }) {
  return {
    sendingLogoutRequest: loginReducer.sendingLogoutRequest,
    loggedIn: loginReducer.loggedIn
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    logout: userData => dispatch(logout())
  }
}

Nav.prototypes = {
  loggedIn: PropTypes.bool.isRequired,
  sendingLogoutRequest: PropTypes.bool.isRequired
}
