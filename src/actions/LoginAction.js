import ApiService from '../services/ApiService';
import { USER_LOGIN } from '../constants/ActionTypes';

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
          data.data['user']= 'Masroor';
        //   data.data["ChallengeName"]= "NEW_PASSWORD_REQUIRED"
          dispatch(loginSuccessful(data.data))
      })
      .catch(error => {
        dispatch(loginSuccessful(error.data))
      })
  }
}