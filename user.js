// owner-based authorization:
function ownerOnly(req, res, next) {
  const user = req.session.passport.user
      , resourceId = req.params.id;
  
  votations.query(votationsConstants.GET_VOTATION_BY_ID, { id: resourceId })
  .then((result) => {
    if (result[0].creator_id !== user.id) return res.sendStatus(401); // или какой там 'Unauthorized'
    return next();
  })
}

//actions/UserActions.js
export function setUser(userData) {
  return { type: SET_USER, userData };
}

export function removeUser() {
  return {type: REMOVE_USER, null }
}

// reducers/userReducer.js
import { SET_USER, REMOVE_USER } from '../constants/UserConstants.js';

const initialState = {
  userData: {
    name: '',
    email: '',
    id: '',
    avatar: '' 
  }
};

export function userReducer(state = initialState, action) {
  switch(action.type) {
    case SET_USER:
      return assign({}, state, {
        userData: state.newState
      });
    case REMOVE_USER:
      return assign({}, state, {
        userData: state.newState
      });
    default:
      return state;
  }
}


// constatnts
// -- config.js
// -- LoginConstants
// -- RegisterConstants
// -- UserConstants
// -- CommonConstants

// испльзовать react-router v3-v2, в v4 отс. onEnter

// constatnts/LoginConstants.js


// constatnts/CommonConstants.js
export commonErrors = {
    ERROR: 'An error occured'
};

// config.js
export import API_BASE_PATH = 'http://localhost:300?';