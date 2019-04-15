import {USER_PROFILE, USER_PROFILE_UPDATE} from '../constants/ActionTypes';

const userProfile = (state=[], action) => {
    switch(action.type) {
        case USER_PROFILE:
            return {
            ...state,
            data: action.data
            };
        case USER_PROFILE_UPDATE:
            return {
            ...state,
            data: action.data
            };
        default:
            return state;
    }
};

export default userProfile;