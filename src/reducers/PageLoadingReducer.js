import { PAGE_LOADING} from "../constants/ActionTypes";
/* Reducer for Page Loading functionality */
const pageLoading = (state = [], action) => {
    switch(action.type) {
        case PAGE_LOADING:
            return{
                ...state,
                data: action.data
            }
        default:
            return state
    }
};

export default pageLoading;
