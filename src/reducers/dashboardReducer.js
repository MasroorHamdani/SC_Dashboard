import { DASHBOARD_DATA } from '../constants/ActionTypes';
/* Reducer for Dashboard functionality */
const dashboard = (state = [], action) => {
    switch(action.type) {
        case DASHBOARD_DATA:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default dashboard;