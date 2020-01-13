import ApiService from '../services/ApiService';
import {DATA_ANALYSIS_PROJECT_LIST_SUB_MENU, DATA_ANALYSIS_INSTALLATION_LIST,
  PROJECT_ANALYSIS_DATA, PROJECT_ALERT_LIST, DISPENSER_DATA,
  PROJECT_METRIC_LIST, CLEAR_REDUCER, MODAL_PROJECT_ANALYSIS_DATA,
  PROJECT_ANALYSIS_INITIALISE, PROJECT_METRIC_INITIALISE,
  PROJECT_IFRAME, ALERT_DATA_INITIALISE, PROJECT_LOCATION_INITIALISE} from '../constants/ActionTypes';

/**
 * Dispatched function to call the API service to get
 * the list of installations for passed project
 * @param {*} config 
 */
export function projectInstallationList(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          if(data && data.data)
            dispatch(dataReceived(data.data))
          else if(data.data === null && data.status === 200)
            dispatch(dataReceived([]))
      })
      .catch(error => {
        dispatch(dataReceived(error))
      })
  }
}

function dataReceived(data) {
  return {
      type: DATA_ANALYSIS_INSTALLATION_LIST,
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
    .catch(error => {
      dispatch(subMenuDataReceived(error))
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
      dispatch(analysisDataReceived(data))
    })
    .catch(error => {
      dispatch(analysisDataReceived(error))
    })
  }
}

function analysisDataReceived(data) {
  return {
    type: PROJECT_ANALYSIS_DATA,
    data
  }
}

/***
 * Function to call the API service to gte the modal view data
 * for selected project and installation
 */
export function modalProjectAnalysisData(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(modalAnalysisDataReceived(data))
    })
    .catch(error => {
      dispatch(modalAnalysisDataReceived(error))
    })
  }
}

function modalAnalysisDataReceived(data) {
  return {
    type: MODAL_PROJECT_ANALYSIS_DATA,
    data
  }
}

/**
 * Dispatched function to call the API services to get
 * the Alert data for selected project
 * for selected time slot
 * @param {*} config
 */
export function projectAlertList(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(projectAlertListReceived(data.data))
    })
    .catch(error => {
      dispatch(projectAlertListReceived(error))
    })
  }
}

function projectAlertListReceived(data) {
  return {
    type: PROJECT_ALERT_LIST,
    data
  }
}

/**
 * Dispatched fucntion to call the API services to get
 * the Dispenser data for selected/ passed dispenser id
 * for selected time slot
 * @param {*} config
 */
export function dispenserData(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(dispenserDataReceived(data))
    })
    .catch(error => {
      dispatch(dispenserDataReceived(error))
    })
  }
}

function dispenserDataReceived(data) {
  return {
    type: DISPENSER_DATA,
    data
  }
}

export function clearDataAnalysis() {
  return {
    type: CLEAR_REDUCER,
  }
}

/**
 * Dispatched function to call the API service to get
 * the list of metrics to be shown on UI
 * @param {*} config 
 */
export function projectDataMetricList(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(projectMetricReceived(data.data))
    })
    .catch(error => {
      dispatch(projectMetricReceived(error.data))
    })
  }
}

function projectMetricReceived(data) {
  return {
    type: PROJECT_METRIC_LIST,
    data
  }
}

export function InitialiseDataState() {
  return {
    type: PROJECT_ANALYSIS_INITIALISE,
    data: []
  }
}

export function InitialiseMetricState() {
  return {
    type: PROJECT_METRIC_INITIALISE,
    data: []
  }
}

export function InitialiseIframeState() {
  return {
    type: PROJECT_IFRAME,
    data: []
  }
}

/**
 * Dispatched function to call the API service to get
 * the Iframe Details to be shown on UI
 * @param {*} config 
 */
export function projectIframe(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(projectIframeReceived(data.data))
    })
  }
}

function projectIframeReceived(data) {
  return {
    type: PROJECT_IFRAME,
    data
  }
}

export function initialiseAlertListState() {
  return {
    type: ALERT_DATA_INITIALISE,
    data: []
  }
}

export function initialiseProjectLocationState() {
  return {
    type: PROJECT_LOCATION_INITIALISE,
    data: []
  }
}