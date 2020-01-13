import { PROJECT_DETAIL_DATA, PROJECT_DATA_INITIALISE} from '../constants/ActionTypes';
/* Reducer for Dashboard functionality */
const projectDetailData = (state = [], action) => {
    switch(action.type) {
        case PROJECT_DETAIL_DATA:
            return{
                ...state,
                data: action.data
            };
        case PROJECT_DATA_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default projectDetailData;