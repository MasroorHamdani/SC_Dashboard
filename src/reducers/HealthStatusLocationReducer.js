import { HEALTH_LOCATION_STATUS, HEALTH_INITIALISE} from "../constants/ActionTypes";
/* Reducer for Health Check for Location functionality */
const healthLocationStatus = (state = [], action) => {
    switch(action.type) {
        case HEALTH_LOCATION_STATUS:
            return{
                ...state,
                data: action.data
            };
        case HEALTH_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default healthLocationStatus;