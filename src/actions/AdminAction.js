import ApiService from '../services/ApiService';
import {ADMIN_PROJECT_CREATE, ADMIN_PROJECT_UPDATE,
    ADMIN_PROJECT_LIST, ADMIN_PROJECT_LOCATION_CREATE} from '../constants/ActionTypes';

/**
 * Dispatched function to call the API service to POST
 * the Project details - 
 * @param {*} config 
 */
export function projectCreation(config) {
    return function (dispatch) {
        ApiService(config).then(data => {
            dispatch(onProjectCreation(data.data))
        })
        .catch(error => {
            dispatch(onProjectCreation(error))
        })
    }
}

function onProjectCreation(data) {
    return {
        type: ADMIN_PROJECT_CREATE,
        data
    }
}

export function projectUpdate(config) {
    return function (dispatch) {
        ApiService(config).then(data => {
            dispatch(onProjectUpdation(data.data))
        })
        .catch(error => {
            dispatch(onProjectUpdation(error))
        })
    }
}

function onProjectUpdation(data) {
    return {
        type: ADMIN_PROJECT_UPDATE,
        data
    }
}

export function projectList(config) {
    return function (dispatch) {
        ApiService(config).then(data => {
            dispatch(onProjectList(data.data))
        })
        .catch(error => {
            dispatch(onProjectList(error))
        })
    }
}

function onProjectList(data) {
    return {
        type: ADMIN_PROJECT_LIST,
        data
    }
}

export function InitialiseAdminProject() {
    return {
      type: ADMIN_PROJECT_CREATE,
      data: []
    }
}
