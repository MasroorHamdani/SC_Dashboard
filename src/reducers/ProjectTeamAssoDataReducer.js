import { PROJECT_TEAM_ASSO_DATA } from '../constants/ActionTypes';
/* Reducer for Team page functionality */
const projectTeamAssoData = (state = [], action) => {
    switch(action.type) {
        case PROJECT_TEAM_ASSO_DATA:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default projectTeamAssoData;