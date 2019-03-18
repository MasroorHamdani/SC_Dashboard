import { HEALTH_STATUS } from "../constants/ActionTypes";
/* Reducer for Login functionality */
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