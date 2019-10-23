import { DATA_ANALYSIS_INSTALLATION_LIST, PROJECT_ANALYSIS_INITIALISE} from '../constants/ActionTypes';
/* Reducer for Data analysis page's left menu project list */
const dataAnalysisInstallationList = (state = [], action) => {
    switch(action.type) {
        case DATA_ANALYSIS_INSTALLATION_LIST:
            return{
                ...state,
                data: action.data
            };
        case PROJECT_ANALYSIS_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default dataAnalysisInstallationList;