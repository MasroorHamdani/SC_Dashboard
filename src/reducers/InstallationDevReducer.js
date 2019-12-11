import { INSTALLATION_DEVICE_UPDATE } from '../constants/ActionTypes';
/**
 * Reducer for projects installation page,
 * with details of installation for a particular Device
 * @param {*} state 
 * @param {*} actions 
 */
const installationDevData = (state =[], actions) => {
    switch(actions.type) {
        case INSTALLATION_DEVICE_UPDATE:
            return {
                ...state,
                data: actions.data
            }
        default:
            return state
    }
}

export default installationDevData;