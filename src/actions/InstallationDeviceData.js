import ApiService from '../services/ApiService';
import {INSTALLATION_DEVICE} from '../constants/ActionTypes';

function installationData(data) {
    return {
        type: INSTALLATION_DEVICE,
        data
    }
}
/**
 * Dispatched function to call the API service to get
 * the Installation data for selected/choosen
 * device under a project under a location.
 * @param {*} config 
 */
export function installationDeviceData(config) {
    return function(dispatch) {
        ApiService(config).then(data => {
            dispatch(installationData(data.data))
        })
    }
}