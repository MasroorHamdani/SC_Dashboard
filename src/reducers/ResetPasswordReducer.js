import { RESET_PASSWORD } from "../constants/ActionTypes";
/* Reducer for Reset Password functionality */
const resetPassword = (state = [], action) => {
    switch(action.type) {
        case RESET_PASSWORD:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default resetPassword;