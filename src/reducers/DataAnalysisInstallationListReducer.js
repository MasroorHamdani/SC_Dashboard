import { DATA_ANALYSIS_INSTALLATION_LIST } from '../constants/ActionTypes';
/* Reducer for Data analysis page's left menu project list */
const dataAnalysisInstallationList = (state = [], action) => {
    switch(action.type) {
        case DATA_ANALYSIS_INSTALLATION_LIST:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default dataAnalysisInstallationList;