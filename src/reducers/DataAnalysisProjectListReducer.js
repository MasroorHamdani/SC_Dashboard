import { DATA_ANALYSIS_PROJECT_LIST } from '../constants/ActionTypes';
/* Reducer for Data analysis page's left menu project list */
const dataAnalysisProjectList = (state = [], action) => {
    switch(action.type) {
        case DATA_ANALYSIS_PROJECT_LIST:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default dataAnalysisProjectList;