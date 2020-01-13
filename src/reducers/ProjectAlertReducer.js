import { PROJECT_ALERT_LIST, ALERT_DATA_INITIALISE} from '../constants/ActionTypes';
/* Reducer for Project alerts data */
const projectAlerts = (state = [], action) => {
    switch(action.type) {
        case PROJECT_ALERT_LIST:
            return{
                ...state,
                data: action.data
            };
        case ALERT_DATA_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default projectAlerts;