import { PROJECT_PC_ANALYSIS_DATA } from '../constants/ActionTypes';
/* Reducer for Data analysis page's Actual analytics data for the device selected */
const dataPCAnalysis = (state = [], action) => {
    switch(action.type) {
        case PROJECT_PC_ANALYSIS_DATA:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default dataPCAnalysis;