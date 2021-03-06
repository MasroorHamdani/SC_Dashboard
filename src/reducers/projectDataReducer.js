import { PROJECT_DETAIL } from '../constants/ActionTypes';
/* Reducer for Project data page */
const projectDetail = (state = [], action) => {
    switch(action.type) {
        case PROJECT_DETAIL:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default projectDetail;