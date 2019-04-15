import { USER_LOGIN, AUTH_KEY_SET } from "../constants/ActionTypes";
/* Reducer for Login functionality */
const login = (state = [], action) => {
    switch(action.type) {
        case USER_LOGIN:
            return{
                ...state,
                data: action.data
            };
        case AUTH_KEY_SET:
            return{
                ...state,
                data: action.data
            }
        default:
            return state
    }
};

export default login;