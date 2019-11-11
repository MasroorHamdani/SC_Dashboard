import ApiService from '../services/ApiService';
import { USER_LOGIN, AUTH_KEY_SET} from '../constants/ActionTypes';

function loginSuccessful(data) {
  return {
      type: USER_LOGIN,
      data
  }
}

/**
 * Dispatched function to call the API service to get
 * User log in details
 * @param {*} config 
 */
export function userLogin(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(loginSuccessful(data.data))
      })
      .catch(error => {
        dispatch(loginSuccessful(error))
      })
  }
}

function authSetSuccessful(data) {
  return {
    type: AUTH_KEY_SET,
    data
  }
}
/**
 * Dispatched function to call the API service to POST
 * the new Password and API Key to server for the logged in user.
 * @param {*} config 
 */
export function setAuthKey(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(authSetSuccessful(data.data))
    })
    .catch(error => {
      dispatch(authSetSuccessful(error.data))
    })
  }
}
