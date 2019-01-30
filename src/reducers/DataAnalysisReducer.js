import { PROJECT_ANALYSIS_DATA } from '../constants/ActionTypes';
/* Reducer for Data analysis page's Actual analytics data for the device selected */
const dataAnalysis = (state = [], action) => {
    switch(action.type) {
        case PROJECT_ANALYSIS_DATA:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default dataAnalysis;