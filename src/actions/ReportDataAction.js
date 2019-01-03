
import ApiService from '../services/ApiService';
import { SERVICE_REQUIREMENT } from '../constants/ActionTypes';

/**
 * Dispatched function to call the API service to get
 * the Report input and output parameter list
 * @param {*} config 
 */
export function serviceRequirementData(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
        dispatch(serviceRequirementReceived(data.data))
      })
  }
}

function serviceRequirementReceived(data) {
    return {
        type: SERVICE_REQUIREMENT,
        data
    }
  }