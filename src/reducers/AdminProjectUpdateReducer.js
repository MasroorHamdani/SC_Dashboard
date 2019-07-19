import { ADMIN_PROJECT_UPDATE} from '../constants/ActionTypes';
/* Reducer for Project Creation */
const projectUpdation = (state = [], action) => {
    switch(action.type) {
        case ADMIN_PROJECT_UPDATE:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default projectUpdation;