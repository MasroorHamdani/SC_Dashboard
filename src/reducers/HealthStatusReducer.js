import { HEALTH_STATUS, HEALTH_STATUS_INITIALISE} from "../constants/ActionTypes";
/* Reducer for Health Check for Project functionality */
const healthStatus = (state = [], action) => {
    switch(action.type) {
        case HEALTH_STATUS:
            return{
                ...state,
                data: action.data
            };
        case HEALTH_STATUS_INITIALISE:
            return{
                data: action.data
            };
        default:
            return state
    }
};

export default healthStatus;