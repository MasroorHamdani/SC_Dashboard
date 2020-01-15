import ApiService from '../services/ApiService';
import {INSTALLATION_DEVICE, INSTALLATION_DEVICE_UPDATE,
    INSTALLATION_LIST_INITIALISE,
    INSTALLATION_INITIALISE, PROJECT_ANALYSIS_INITIALISE } from '../constants/ActionTypes';

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
        .catch(error => {
            dispatch(installationData(error))
        })
    }
}

function updatedInstallationData(data) {
    return {
        type: INSTALLATION_DEVICE_UPDATE,
        data
    }
}

export function updateDeviceData(config) {
    return function(dispatch) {
        ApiService(config).then(data => {
            dispatch(updatedInstallationData(data))
        })
        .catch(error => {
            dispatch(updatedInstallationData(error))
        })
    }
}

export function initialiseInstallationState() {
    return {
      type: INSTALLATION_INITIALISE,
      data: []
    }
}

export function initialiseInstallationListState() {
    return {
      type: PROJECT_ANALYSIS_INITIALISE,//INSTALLATION_LIST_INITIALISE,
      data: []
    }
}