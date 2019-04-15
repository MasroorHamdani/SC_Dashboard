import { REPORTS_LIST} from '../constants/ActionTypes';
/* Reducer for Service input and output requirements list */
const reportsList = (state = [], action) => {
    switch(action.type) {
        case REPORTS_LIST:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default reportsList;