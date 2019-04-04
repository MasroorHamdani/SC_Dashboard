
import ApiService from '../services/ApiService';
import { SERVICE_REQUIREMENT, REPORT_SERVICE_LIST} from '../constants/ActionTypes';

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

/**
 * Dispatched function to call the API service to get
 * the Report Service list to be displayed to user
 * to select the service and fetch those reports to be downloaded.
 * @param {*} config 
 */
export function reportServiceList(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
        dispatch(reportServiceListReceived(data.data))
      })
  }
}

function reportServiceListReceived(data) {
  return {
      type: REPORT_SERVICE_LIST,
      data
  }
}