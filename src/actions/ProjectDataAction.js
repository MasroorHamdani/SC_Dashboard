import ApiService from '../services/ApiService';
import { PROJECT_DETAIL, PROJECT_DETAIL_DATA, PROJECT_TEAM_DATA } from '../constants/ActionTypes';

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

function detailedDataReceived(data) {
    return {
        type: PROJECT_DETAIL_DATA,
        data
    }
}


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


export function projectTeamData(config) {
    return function (dispatch) {
        ApiService(config).then(data => {
            //on success we will dispatch a sync action with the data
            dispatch(teamDataReceived(data.data))
        })
    }
}
