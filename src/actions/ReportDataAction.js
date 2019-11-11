
import ApiService from '../services/ApiService';
import { SERVICE_REQUIREMENT, REPORT_SERVICE_LIST,
  REPORTS_LIST} from '../constants/ActionTypes';

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
      .catch(error => {
        dispatch(serviceRequirementReceived(error))
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
        if (data.data)
          dispatch(reportServiceListReceived(data.data))
        else if (data.data === null)
          dispatch(reportServiceListReceived([]))
      })
      .catch(error => {
        dispatch(reportServiceListReceived(error))
      })
  }
}

function reportServiceListReceived(data) {
  return {
      type: REPORT_SERVICE_LIST,
      data
  }
}

/**
 * Dispatched function to call the API service to get
 * the Reports list to be displayed to user
 * to select the service.
 * @param {*} config 
 */
export function reportsList(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
        dispatch(reportListReceived(data.data))
      })
      .catch(error => {
        dispatch(reportListReceived(error))
      })
  }
}

function reportListReceived(data) {
  return {
      type: REPORTS_LIST,
      data
  }
}