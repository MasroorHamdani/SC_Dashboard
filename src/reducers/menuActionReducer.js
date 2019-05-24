import { TOOGLE_MENU} from "../constants/ActionTypes";
/* Reducer for Login functionality */
const toggleMenu = (state = [], action) => {
    switch(action.type) {
        case TOOGLE_MENU:
            return{
                ...state,
                data: action.data
            }
        default:
            return state
    }
};

export default toggleMenu;