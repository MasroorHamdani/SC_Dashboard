import { PROJECT_IFRAME } from '../constants/ActionTypes';
/* Reducer for Iframe Details functionality */
const iframe = (state = [], action) => {
    switch(action.type) {
        case PROJECT_IFRAME:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default iframe;