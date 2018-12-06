import ApiService from '../services/ApiService';
import { USER_LOGIN, AUTH_KEY_SET } from '../constants/ActionTypes';

function loginSuccessful(data) {
  return {
      type: USER_LOGIN,
      data
  }
}

export function userLogin(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          // data.data['user']= 'Masroor';
        //   data.data["ChallengeName"]= "NEW_PASSWORD_REQUIRED"
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
export function setAuthKey(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(authSetSuccessful(data.data))
    })
  }
}