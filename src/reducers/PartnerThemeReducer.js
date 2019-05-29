import { PARTNER_THEME } from '../constants/ActionTypes';
/* Reducer for partnerTheme functionality */
const partnerTheme = (state = [], action) => {
    switch(action.type) {
        case PARTNER_THEME:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default partnerTheme;