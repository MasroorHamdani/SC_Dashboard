import ApiService from '../services/ApiService';
import {ADMIN_PROJECT_CREATE} from '../constants/ActionTypes';

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
