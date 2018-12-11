import ApiService from '../services/ApiService';
import { DATA_ANALYSIS_PROJECT_LIST, DATA_ANALYSIS_PROJECT_LIST_SUB_MENU,
  PROJECT_ANALYSIS_DATA } from '../constants/ActionTypes';

function dataReceived(data) {
  return {
      type: DATA_ANALYSIS_PROJECT_LIST,
      data
  }
}
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

function subMenuDataReceived(data) {
  return {
    type: DATA_ANALYSIS_PROJECT_LIST_SUB_MENU,
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

function AnalysisDataReceived(data) {
  return {
    type: PROJECT_ANALYSIS_DATA,
    data
  }
}

/**
 * Dispatched function to call the API service to get
 * the Analytics data - Get complete Analytics data to be shown to user
 * for any Device selected.
 * @param {*} config 
 */
export function projectAnalysisData(config) {
  return function(dispatch) {
    ApiService(config).then(data => {
      dispatch(AnalysisDataReceived(data.data))
    })
  }
}