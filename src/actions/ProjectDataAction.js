import ApiService from '../services/ApiService';
import { PROJECT_DETAIL } from '../constants/ActionTypes';

function dataReceived(data) {
  return {
      type: PROJECT_DETAIL,
      data
  }
}

export function projectData(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(dataReceived(data.data))
      })
  }
}