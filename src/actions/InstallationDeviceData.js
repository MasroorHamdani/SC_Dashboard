import ApiService from '../services/ApiService';
import {INSTALLATION_DEVICE} from '../constants/ActionTypes';

function installationData(data) {
    return {
        type: INSTALLATION_DEVICE,
        data
    }
}
export function installationDeviceData(config) {
    return function(dispatch) {
        ApiService(config).then(data => {
            dispatch(installationData(data.data))
        })
    }
}