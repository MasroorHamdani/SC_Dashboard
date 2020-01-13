import { PROJECT_TEAM_ASSO_DATA, PROJECT_TEAM_ASSOCIATION_INITIALISE} from '../constants/ActionTypes';
/* Reducer for Team page functionality */
const projectTeamAssoData = (state = [], action) => {
    switch(action.type) {
        case PROJECT_TEAM_ASSO_DATA:
            return{
                ...state,
                data: action.data
            };
        case PROJECT_TEAM_ASSOCIATION_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default projectTeamAssoData;