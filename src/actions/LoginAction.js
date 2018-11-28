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
          dispatch(loginSuccessful(data.data))
      })
  }
}