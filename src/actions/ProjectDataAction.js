import ApiService from '../services/ApiService';
import { PROJECT_DETAIL, PROJECT_DETAIL_DATA, PROJECT_TEAM_DATA,
    PROJECT_TEAM_ASSO_DATA, PROJECT_USER_CREATE} from '../constants/ActionTypes';

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
      .catch(error => {
        dispatch(dataReceived(error))
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
            // if(data)
            dispatch(detailedDataReceived(data.data))
        })
        .catch(error => {
            dispatch(detailedDataReceived(error))
        })
    }
}

function teamAssoDataReceived(data) {
    return {
        type: PROJECT_TEAM_ASSO_DATA,
        data
    }
}

/**
 * Dispatched function to call the API service to get
 * the Project Team Association data - 
 * This includes all the association team member have under selected project.
 * @param {*} config 
 */
export function projectTeamAsso(config) {
    return function (dispatch) {
        ApiService(config).then(data => {
            //on success we will dispatch a sync action with the data
            dispatch(teamAssoDataReceived(data.data))
        })
        .catch(error => {
            dispatch(teamAssoDataReceived(error))
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
        .catch(error => {
            dispatch(teamDataReceived(error))
        })
    }
}

function userCreated(data) {
    return {
        type: PROJECT_USER_CREATE,
        data
    }
}

/**
 * Dispatched function to call the API service to get
 * the User created API call.
 * @param {*} config 
 */
export function userCreation(config) {
    return function (dispatch) {
        ApiService(config).then(data => {
            //on success we will dispatch a sync action with the data
            dispatch(userCreated(data.data))
        })
        .catch(error => {
            dispatch(userCreated(error))
        })
    }
}