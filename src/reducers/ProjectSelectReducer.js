import { PROJECT_SELECTED } from "../constants/ActionTypes";
/* Reducer for selecting the state and have tat state present in every page
which has project specific data */
const projectSelect = (state = [], action) => {
    switch(action.type) {
        case PROJECT_SELECTED:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default projectSelect;