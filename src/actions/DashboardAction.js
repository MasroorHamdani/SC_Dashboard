import ApiService from '../services/ApiService';
import { DASHBOARD_DATA } from '../constants/ActionTypes';

function dataReceived(data) {
  return {
      type: DASHBOARD_DATA,
      data
  }
}

export function dashboardData(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(dataReceived(data.data))
      })
  }
}