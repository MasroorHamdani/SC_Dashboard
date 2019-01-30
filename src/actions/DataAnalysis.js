import ApiService from '../services/ApiService';
import { DATA_ANALYSIS_PROJECT_LIST, DATA_ANALYSIS_PROJECT_LIST_SUB_MENU,
  PROJECT_ANALYSIS_DATA, PROJECT_ALERT_LIST } from '../constants/ActionTypes';

/**
 * Dispatched function to call the API service to get
 * the data for menu - List of all projects for a user
 * @param {*} config 
 */
export function projectMenuList(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          if(data && data.data)
            dispatch(dataReceived(data.data))
          // else
          // dispatch(dataReceived(data.data))
      })
  }
}

function dataReceived(data) {
  return {
      type: DATA_ANALYSIS_PROJECT_LIST,
      data
  }
}

/**
 * Dispatched function to call the API service to get
 * the data for sub menu - List of all the devices for all projects for a user
 * @param {*} config 
 */
export  function projectSubMenuList(config) {
  return function (dispatch) {
    ApiService(config).then(data => {
        //on success we will dispatch a sync action with the data
        dispatch(subMenuDataReceived(data.data))
    })
  }
}

function subMenuDataReceived(data) {
  return {
    type: DATA_ANALYSIS_PROJECT_LIST_SUB_MENU,
    data
  }
}

/**
 * Dispatched function to call the API service to get
 * the Analytics PC data - Get complete People Count Sensor Analytics data to be shown to user
 * for any Device selected.
 * @param {*} config 
 */
export function projectAnalysisData(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(AnalysisDataReceived(data))
    })
  }
}

function AnalysisDataReceived(data) {
  return {
    type: PROJECT_ANALYSIS_DATA,
    data
  }
}


/**
 * Dispatched fucntion to call the API services to get
 * the Alert data for selected project
 * for selected time slot
 * @param {*} config
 */
export function projectAlertList(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(projectAlertListReceived(data.data))
    })
  }
}

function projectAlertListReceived(data) {
  return {
    type: PROJECT_ALERT_LIST,
    data
  }
}