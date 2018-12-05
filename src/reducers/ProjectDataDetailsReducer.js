import { PROJECT_DETAIL_DATA } from '../constants/ActionTypes';
/* Reducer for Dashboard functionality */
const projectDetailData = (state = [], action) => {
    switch(action.type) {
        case PROJECT_DETAIL_DATA:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default projectDetailData;