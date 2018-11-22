import { USER_LOGIN } from "../constants/ActionTypes";
/* Reducer for Login functionality */
const login = (state = [], action) => {
    switch(action.type) {
        case USER_LOGIN:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default login;