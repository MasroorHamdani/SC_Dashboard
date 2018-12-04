import ApiService from '../services/ApiService';
import { FORGOT_PASSWORD } from '../constants/ActionTypes';

function forgotSuccessful(data) {
  return {
      type: FORGOT_PASSWORD,
      data
  }
}

export function forgotPassword(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(forgotSuccessful(data.data))
      })
  }
}