import { DATA_ANALYSIS_PROJECT_LIST_SUB_MENU, PROJECT_LOCATION_INITIALISE} from '../constants/ActionTypes';
/* Reducer for Data analysis page's left Sub menu project list */
const dataAnalysisProjectListSubMenu = (state = [], action) => {
    switch(action.type) {
        case DATA_ANALYSIS_PROJECT_LIST_SUB_MENU:
            return{
                ...state,
                data: action.data
            };
        case PROJECT_LOCATION_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default dataAnalysisProjectListSubMenu;