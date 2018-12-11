import ApiService from '../services/ApiService';
import { PROJECT_DETAIL, PROJECT_DETAIL_DATA, PROJECT_TEAM_DATA } from '../constants/ActionTypes';

function dataReceived(data) {
  return {
      type: PROJECT_DETAIL,
      data
  }
}

/**
 * Dispatched function to call the API service to get
 * the Project General data - This include, name, location, image etc
 * @param {*} config 
 */
export function projectData(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(dataReceived(data.data))
      })
  }
}

function detailedDataReceived(data) {
    return {
        type: PROJECT_DETAIL_DATA,
        data
    }
}

/**
 * Dispatched function to call the API service to get
 * the Project Installation details - 
 * This included the locations and 
 * other details regarding intallation under a selected project
 * @param {*} config 
 */
export function projectDetailData(config) {
    return function (dispatch) {
        ApiService(config).then(data => {
            //on success we will dispatch a sync action with the data
            dispatch(detailedDataReceived(data.data))
        })
    }
}

function teamDataReceived(data) {
    return {
        type: PROJECT_TEAM_DATA,
        data
    }
}

/**
 * Dispatched function to call the API service to get
 * the Project Team data - 
 * This includes all the the team member details under selected project.
 * @param {*} config 
 */
export function projectTeamData(config) {
    return function (dispatch) {
        ApiService(config).then(data => {
            //on success we will dispatch a sync action with the data
            dispatch(teamDataReceived(data.data))
        })
    }
}
