import {USER_PROFILE, USER_PROFILE_UPDATE,
    PROJECT_USER_CREATE, USER_SEARCH} from '../constants/ActionTypes';

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
        case PROJECT_USER_CREATE:
            return {
                ...state,
                data: action.data
            };
        case USER_SEARCH:
            return {
                ...state,
                data: action.data
            }
        default:
            return state;
    }
};

export default userProfile;