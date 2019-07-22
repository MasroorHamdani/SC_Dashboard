import { ADMIN_PROJECT_CREATE, ADMIN_PROJECT_LOCATION_CREATE, ADMIN_PROJECT_LIST} from '../constants/ActionTypes';
/* Reducer for Project Creation */
const projectAddition = (state = [], action) => {
    switch(action.type) {
        case ADMIN_PROJECT_CREATE:
            return{
                ...state,
                data: action.data
            };
        case ADMIN_PROJECT_LOCATION_CREATE:
            return{
                ...state,
                data: action.data
            };
        case ADMIN_PROJECT_LIST:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default projectAddition;