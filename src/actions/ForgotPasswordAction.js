import ApiService from '../services/ApiService';
import { FORGOT_PASSWORD } from '../constants/ActionTypes';

function forgotSuccessful(data) {
  return {
      type: FORGOT_PASSWORD,
      data
  }
}

/**
 * Dispatched function to call the API service to
 * send user request for forgot password.
 * This will internall send a mail from Server side to requested user
 * @param {*} config 
 */
export function forgotPassword(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(forgotSuccessful(data.data))
      })
      .catch(error => {
        dispatch(forgotSuccessful(error))
      })
  }
}