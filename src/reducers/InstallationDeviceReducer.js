import { INSTALLATION_DEVICE, INSTALLATION_INITIALISE} from '../constants/ActionTypes';
/**
 * Reducer for projects installation page,
 * with details of installation for a particular Device
 * @param {*} state 
 * @param {*} action 
 */
const installationDeviceData = (state =[], action) => {
    switch(action.type) {
        case INSTALLATION_DEVICE:
            return {
                ...state,
                data: action.data
            };
        case INSTALLATION_INITIALISE:
            return action.data
        default:
            return state
    }
}

export default installationDeviceData;