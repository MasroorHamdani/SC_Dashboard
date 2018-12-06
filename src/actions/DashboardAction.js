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
          if(data && data.data)
            dispatch(dataReceived(data.data[0]))
          else
          dispatch(dataReceived(data.data))
      })
  }
}