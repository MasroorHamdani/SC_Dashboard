import {USER_PROFILE} from '../constants/ActionTypes';

const userProfile = (state=[], action) => {
    switch(action.type) {
        case USER_PROFILE:
            return {
            ...state,
            data: action.data
            };
        default:
            return state;
    }
};

export default userProfile;