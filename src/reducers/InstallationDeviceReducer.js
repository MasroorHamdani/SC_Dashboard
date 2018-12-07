import { INSTALLATION_DEVICE } from '../constants/ActionTypes';
/**
 * Reducer for projects installation page,
 * with details of installation for a particular Device
 * @param {*} state 
 * @param {*} actions 
 */
const installationDeviceData = (state =[], actions) => {
    switch(actions.type) {
        case INSTALLATION_DEVICE:
            return {
                ...state,
                data: actions.data
            }
        default:
            return state
    }
}

export default installationDeviceData;