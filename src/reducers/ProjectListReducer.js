import { PROJECT_LIST } from "../constants/ActionTypes";
/* Reducer for selecting the state and have tat state present in every page
which has project specific data */
const projectList = (state = [], action) => {
    switch(action.type) {
        case PROJECT_LIST:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default projectList;