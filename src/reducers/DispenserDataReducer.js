import { DISPENSER_DATA } from '../constants/ActionTypes';
/* Reducer for Data analysis page's Actual analytics data for the device selected */
const dispenserData = (state = [], action) => {
    switch(action.type) {
        case DISPENSER_DATA:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default dispenserData;