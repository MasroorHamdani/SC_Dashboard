import ApiService from '../services/ApiService';
import { RESET_PASSWORD } from '../constants/ActionTypes';

function passwordResetSuccessful(data) {
  return {
      type: RESET_PASSWORD,
      data
  }
}

export function resetPassword(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(passwordResetSuccessful(data.status))
      })
  }
}