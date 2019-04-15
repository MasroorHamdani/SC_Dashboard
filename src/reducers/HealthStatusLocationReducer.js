import { HEALTH_LOCATION_STATUS } from "../constants/ActionTypes";
/* Reducer for Health Check for Location functionality */
const healthLocationStatus = (state = [], action) => {
    switch(action.type) {
        case HEALTH_LOCATION_STATUS:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default healthLocationStatus;