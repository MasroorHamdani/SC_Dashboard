import { PROJECT_TEAM_DATA } from '../constants/ActionTypes';
/* Reducer for Dashboard functionality */
const projectTeamData = (state = [], action) => {
    switch(action.type) {
        case PROJECT_TEAM_DATA:
            return{
                ...state,
                data: action.data
            };
        default:
            return state
    }
};

export default projectTeamData;