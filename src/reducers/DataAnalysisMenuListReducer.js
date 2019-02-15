import { DATA_ANALYSIS_MENU_LIST, CLEAR_REDUCER} from '../constants/ActionTypes';
/* Reducer for Data analysis page's left menu project list */
const dataAnalysisMenuList = (state = [], action) => {
    switch(action.type) {
        case DATA_ANALYSIS_MENU_LIST:
            return{
                ...state,
                data: action.data
            };
        case CLEAR_REDUCER:
            return []
        default:
            return state
    }
};

export default dataAnalysisMenuList;