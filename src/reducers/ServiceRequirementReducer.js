import { SERVICE_REQUIREMENT, REPORT_SERVICE_LIST} from '../constants/ActionTypes';
/* Reducer for Service input and output requirements list */
const serviceRequirementData = (state = [], action) => {
    switch(action.type) {
        case SERVICE_REQUIREMENT:
            return{
                ...state,
                data: action.data
            };
        case REPORT_SERVICE_LIST:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default serviceRequirementData;