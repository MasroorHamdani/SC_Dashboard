import ApiService from '../services/ApiService';
import { DATA_ANALYSIS_PROJECT_LIST, DATA_ANALYSIS_PROJECT_LIST_SUB_MENU,
  PROJECT_AQ_ANALYSIS_DATA, PROJECT_PC_ANALYSIS_DATA,
  PROJECT_PC_METRICS_DATA, PROJECT_AQ_METRICS_DATA } from '../constants/ActionTypes';

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
            dispatch(dataReceived(data.data[0]))
          else
          dispatch(dataReceived(data.data))
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
 * the Analytics AQ data - Get complete Air Quality Sensor Analytics data to be shown to user
 * for any Device selected.
 * @param {*} config 
 */
export function projectAQAnalysisData(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(AnalysisAQDataReceived(data.data))
    })
  }
}

function AnalysisAQDataReceived(data) {
  return {
    type: PROJECT_AQ_ANALYSIS_DATA,
    data
  }
}

/**
 * Dispatched function to call the API service to get
 * the Analytics PC data - Get complete People Count Sensor Analytics data to be shown to user
 * for any Device selected.
 * @param {*} config 
 */
export function projectPCAnalysisData(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(AnalysisPCDataReceived(data.data))
    })
  }
}

function AnalysisPCDataReceived(data) {
  return {
    type: PROJECT_PC_ANALYSIS_DATA,
    data
  }
}

/**
 * Dispatched fucntion to call the API services to get
 * the PC Metrics data - This will be used to get the path of the graph plot
 * @param {*} config
 */
export function projectPCMetricsData(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(AnalysisPCMetricsReceived(data.data))
    })
  }
}

function AnalysisPCMetricsReceived(data) {
  return {
    type: PROJECT_PC_METRICS_DATA,
    data
  }
}

/**
 * Dispatched fucntion to call the API services to get
 * the AQ Metrics data - This will be used to get the path of the graph plot
 * @param {*} config
 */
export function projectAQMetricsData(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(AnalysisAQMetricsReceived(data.data))
    })
  }
}

function AnalysisAQMetricsReceived(data) {
  return {
    type: PROJECT_AQ_METRICS_DATA,
    data
  }
}