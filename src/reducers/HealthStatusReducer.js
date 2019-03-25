import { HEALTH_STATUS } from "../constants/ActionTypes";
/* Reducer for Health Check for Project functionality */
const healthStatus = (state = [], action) => {
    switch(action.type) {
        case HEALTH_STATUS:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default healthStatus;