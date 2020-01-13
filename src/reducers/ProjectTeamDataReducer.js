import { PROJECT_TEAM_DATA, PROJECT_TEAM_MEMBER_INITIALISE} from '../constants/ActionTypes';
/* Reducer for Dashboard functionality */
const projectTeamData = (state = [], action) => {
    switch(action.type) {
        case PROJECT_TEAM_DATA:
            return{
                ...state,
                data: action.data
            };
        case PROJECT_TEAM_MEMBER_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default projectTeamData;