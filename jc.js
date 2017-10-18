'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ControlledInput from '../ControlledInput.js';
import LoadingButton from '../LoadingButton.js';
import { 
  changeFrom,
  setRegisterFormIsValid,
  setRegisterFormErrorMessages
} from '../../actions/registerActions.js';

const assign = Object.assign

// TODO: avatar upload
class RegisterPage extends Component {
  render() {
    let submitBtn;

    if (!this.props.isRegisterFormValid) {
      submitBtn = 
      <button className = 'form__submit-btn' type = 'submit'>Send</button>
    } else if (this.props.sendingRegisterRequest) {
      submitBtn = <LoadingButton btnText = {'Send'}/>
    } else {
      submitBtn = 
      <button className="form__submit-btn form__submit-btn_active" type="submit">Send</button>
    }

    return (
      <div className = 'form-page__wrapper'>        
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Login</h2>
          </div>

          <div className = 'form' onSubmit = {this._onSubmit.bind(this)}> //new
            <ControlledInput formId = {'name'}
              fieldName = {'Name'}
              type = {'text'}
              value = {this.props.registerFormState.name}
              placeholder = {'Enter Your Name'}
              onChange = {this._onChangeName.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.name}
            />
            <ControlledInput formId = {'email'}
              fieldName = {'Email'}
              type = {'text'}
              value = {this.props.registerFormState.email}
              placeholder = {'Enter Your Email'}
              onChange = {this._onChangeEmail.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.email}
            />
            <ControlledInput formId = {'password1'}
              fieldName = {'Password'}
              type = {'password'}
              value = {this.props.registerFormState.password1} 
              onChange = {this._onChangePassword1.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.password2}
            />
            <ControlledInput formId = {'password2'}
              fieldName = {'Confirm Password'}
              type = {'password'}
              value = {this.props.registerFormState.password1}
              onChange = {this._onChangePassword2.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.password2}
            />
            <div className = 'form__submit-btn-wrapper'> //
              {submitBtn} //
            </div> //
          </div>          
          
          <div className='form-page__form-footer'> //
            <div className='form-page__form-error'>{this.props.registerError}</div> //
          </div> //
        </div>
      </div>
    );
  }

  // new + в registerReducer убать валидацию и правильно описать поля в отправляемом через fetch body.
  _onSubmit(event) {
    event.preventDefault();
    if (this.props.isRegisterFormValid) {
      this.props.dispatch(this.props.register({
        this.props.registerFormState.name,
        this.props.registerFormState.email,
        this.props.registerFormState.password2,
        this.props.registerFormState.avatar
      }));
    }
  }
}

// new
function mapDispatchToProps(dispatch) {
  return {
    login: dispatch.register;
  }
}

// new
export function register(userData) {
  return (dispatch, getState) => {
    dispatch(sendingRegisterRequest(true));

    let { isRegisterFormValid } = getState();

    if (!isRegisterFormValid) {
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
      body: JSON.stringify({ 
        name: userData.name,
        email: userData.email, 
        password: userData.password,
        avatart: userData.avatart 
      })
    })
    .then((res) => {
      _status = res.status;
      return res.json();
    })
    .then((json) => {
      let data = JSON.parse(json);
      if (_status === 201) {
        dispatch(setRegisterError(''))
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
