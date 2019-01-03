import { SERVICE_REQUIREMENT } from '../constants/ActionTypes';
/* Reducer for Service input and output requirements list */
const serviceRequirementData = (state = [], action) => {
    switch(action.type) {
        case SERVICE_REQUIREMENT:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default serviceRequirementData;