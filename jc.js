import { 
  getVotations, 
  getUserVotations, 
  searchVotations 
} from '../actions/votationsActions.js';
import { searchUsers } from '../actions/userActions.js';
// import { setCurView, setPaginationOffset } from '../actions/dataListActions.js';
import { 
  DEFAULT_PAGINATION_OFFSET, 
  DEFAULT_PAGINATION_LIMIT 
} from '../constants/commonConstants.js';
import {
  DATA_LIST_VOTATIONS_VIEW,
  DATA_LIST_USER_VOTATIONS_VIEW,
  DATA_LIST_VOTATIONS_SEARCH_VIEW,
  DATA_LIST_USERS_SEARCH_VIEW
} from '../constants/dataListConstants.js'

class DataList extends  Component {
  componentDidMount() {
    const { 
      location, getVotations, getUserVotations,
      setCurView, setPaginationOffset,
      currentPaginationOffset
    } = this.props;

    if (location === '/dashboard') {
      //setCurView(DATA_LIST_VOTATIONS_VIEW);      
      getVotations({ 
        offset: DEFAULT_PAGINATION_OFFSET, 
        limit: DEFAULT_PAGINATION_LIMIT
      });
    } else if (/users\/[0-9]+/.test(location)) {
      let userId = Number.parseInt(location.split('/')[2]);

      //setCurView(DATA_LIST_USER_VOTATIONS_VIEW);
      getUserVotations({
        offset: DEFAULT_PAGINATION_OFFSET, 
        limit: DEFAULT_PAGINATION_LIMIT, 
        userId 
      });
    }

    //setPaginationOffset(currentPaginationOffset + DEFAULT_PAGINATION_OFFSET);
  }

  render() {
    const { currentView, currentViewData } = this.props;
    return(
      let dataList;
      if (currentView === DATA_LIST_VOTATIONS_VIEW ||
          currentView === DATA_LIST_USER_VOTATIONS_VIEW ||
          currentView === DATA_LIST_VOTATIONS_SEARCH_VIEW) {
      
        datalist = currentViewData.map((item) => {
          return <VotationCard />
        });
      } else if (currentView === DATA_LIST_USERS_SEARCH_VIEW) {
        dataList = currentViewData.map((item) => {
          return <UserCard />
        });
      }
    );
  }

  _onScroll(event) {
    const { currentPaginationOffset, currentView } = this.props;

    let userId;
    if (currentView === DATA_LIST_USER_VOTATIONS_VIEW) {
      userId = Number.parseInt(location.split('/')[2])
    }

    this.props.dispatchLastRequest(currentView, {
      offset: currentPaginationOffset, 
      limit: DEFAULT_PAGINATION_LIMIT, 
      userId
    });
  }
}

// возможно setCurView и setPaginationOffset выставлять внутри соотв. thunk`а?
// each of 4 types requests should set lastRequest dataList state variable

function mapStateToProps({ userReducer, votationsReducer, dataListReducer }) {
  return {
    currentView: dataListReducer.currentView,
    currentPaginationOffset: dataListReducer.currentPaginationOffset
  };
}

DataList.prototypes = {
  getVotations: PropTypes.func.isRequired,
  getUserVotations: PropTypes.func.isRequired,
  searchVotations: PropTypes.func.isRequired,

  searchUsers: PropTypes.func.isRequired,

  currentlySendingPaginationReq: PropTypes.bool.isRequired,
  currentView: PropTypes.bool.isRequired,
  currentViewData: PropTypes.bool.isRequired,
  currentPaginationOffset: PropTypes.number.isRequired,
  sendingPaginationRequest: PropTypes.bool.isRequired,  
}

// ./actions/votationsActions.js
import { 
  setCurView, 
  setCurViewData,
  setPaginationOffset,
  sendingPaginationRequest
} from '../actions/dataListActions.js';
import {
  DATA_LIST_VOTATIONS_VIEW,
  DATA_LIST_USER_VOTATIONS_VIEW,
  DATA_LIST_VOTATIONS_SEARCH_VIEW,
  DATA_LIST_USERS_SEARCH_VIEW
} from '../constants/dataListConstants.js'
import { API_BASE_PATH } from '../../config.js';

export function getVotations(data) {
  return (dispatch, getState) {    
    if (getState().currentView !=== DATA_LIST_VOTATIONS_VIEW) {
      dispatch(setCurViewData([]));
      dispatch(setCurView(DATA_LIST_VOTATIONS_VIEW));
    }

    dispatch(sendingPaginationRequest(true));
    
    let _status;

    fetch(API_BASE_PATH + '/votations' + constructQuery(data), {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
    })
    .then(res => {
      _status = res.status;
      return res.json();
    })
    .then((json) => { 
      let data = JSON.parse(json);

      if (_status === 200) {
        dispatch(setCurViewData(data));

      } else if (_status === 400) {
        // TODO
      } else {
        // TODO
      }
      dispatch(sendingPaginationRequest(false));
    })
    .catch((err) => {
        dispatch(setErrorMessage('login', commonErrors.ERROR));
        dispatch(sendingLoginRequest(false));
    });
  };
}

// ./constants/dataListConstants.js
'use strict';

module.exports =  {
  DATA_LIST_VOTATIONS_VIEW: 'DATA_LIST_VOTATIONS_VIEW',
  DATA_LIST_USER_VOTATIONS_VIEW: 'DATA_LIST_USER_VOTATIONS_VIEW',
  DATA_LIST_VOTATIONS_SEARCH_VIEW: 'DATA_LIST_VOTATIONS_SEARCH_VIEW',
  DATA_LIST_USERS_SEARCH_VIEW: 'DATA_LIST_USERS_SEARCH_VIEW',

  SET_CUR_VIEW: 'SET_CUR_VIEW',
  SET_CUR_VIEW_DATA: 'SET_CUR_VIEW_DATA',
  SENDING_PAGINATION_REQUEST: 'SENDING_PAGINATION_REQUEST',
  SET_PAGINATION_OFFSET: 'SET_PAGINATION_OFFSET'
}

// .actions/dataListActions.js
import { 
  getVotations, 
  getUserVotations, 
  searchVotations 
} from '../actions/votationsActions.js';
import { searchUsers } from '../actions/userActions.js';

export function dispatchLastRequest(view, paginationOffset, limit, data) {
  return (dispatch, getState) => {
    let request;
    switch(view) {
      case DATA_LIST_VOTATIONS_VIEW:
        request = getVotations;
      case DATA_LIST_USER_VOTATIONS_VIEW:
        request = getUserVotations;
      case DATA_LIST_VOTATIONS_SEARCH_VIEW:
        request = searchVotations;
      case DATA_LIST_USERS_SEARCH_VIEW:
        request = searchUsers;
      default:
        request = getVotations;
    }

    dispatch(request(paginationOffset, limit, data));
  };
}

export function setCurView(view) {
  return { type: SET_CUR_VIEW, currentView: view }
}

export function setCurViewData(data) {
  return { type: SET_CUR_VIEW_DATA, currentViewData: data }
}

export function setPaginationOffset(offset) {
  return { type: SET_PAGINATION_OFFSET, currentPaginationOffset: offset }
  }
}

export function sendingPaginationRequest(sending) {
  return { type: SENDING_PAGINATION_REQUEST, sendingPaginationRequest: sending };
}

// ./reducers/datalistReducer.js
import {
  DATA_LIST_VOTATIONS_VIEW,

  SET_CUR_VIEW,
  SET_CUR_VIEW_DATA,
  SENDING_PAGINATION_REQUEST,
  SET_PAGINATION_OFFSET
} from '../constants/dataListConstants.js'

import { 
  DEFAULT_PAGINATION_OFFSET, 
} from '../constants/commonConstants.js';

const initialState = {
  currentView: DATA_LIST_VOTATIONS_VIEW,
  currentViewData: [],
  currentPaginationOffset: DEFAULT_PAGINATION_OFFSET,
  sendingPaginationRequest: false
}

const assign = Object.assign;

export default datalistReducer(state = initialState, action) {
  switch(action.type) {
    case SET_CUR_VIEW:
      return assign({}, state, {
        currentView: action.currentView
      });
    case SET_CUR_VIEW_DATA: {
      let newData = state.currentViewData;
      newData.push(action.currentViewData);

      return assign({}, state, {
        currentViewData: newData
      });
    }
    case SENDING_PAGINATION_REQUEST: 
      return assign({}, state, {
        sendingPaginationRequest: action.sendingPaginationRequest
      });
    case SET_PAGINATION_OFFSET:
      return assign({}, state, {
        currentPaginationOffset: actions.offset
      });
    default:
      return state;
  }
}
