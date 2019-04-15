import { FORGOT_PASSWORD } from "../constants/ActionTypes";
/* Reducer for Forgot Password functionality */
const forgotPassword = (state = [], action) => {
    switch(action.type) {
        case FORGOT_PASSWORD:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default forgotPassword;