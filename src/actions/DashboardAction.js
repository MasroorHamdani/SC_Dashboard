import ApiService from '../services/ApiService';
import { DASHBOARD_DATA } from '../constants/ActionTypes';

function dataReceived(data) {
  return {
      type: DASHBOARD_DATA,
      data
  }
}

/**
 * Dispatched function to call the API service to get
 * the Dashboard data - List of Projects for logged in User,
 * along with user details itself
 * @param {*} config 
 */
export function dashboardData(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          if(data && data.data)
            dispatch(dataReceived(data.data))
          else
            dispatch(dataReceived(data.data))
      })
  }
}