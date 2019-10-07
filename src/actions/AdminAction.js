import ApiService from '../services/ApiService';
import {ADMIN_PROJECT_CREATE, ADMIN_PROJECT_UPDATE,
    ADMIN_PROJECT_LIST} from '../constants/ActionTypes';

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
    }
}

function onProjectList(data) {
    return {
        type: ADMIN_PROJECT_LIST,
        data
    }
}