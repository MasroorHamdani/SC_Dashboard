import { PROJECT_METRIC_LIST, PROJECT_METRIC_INITIALISE} from '../constants/ActionTypes';
/* Reducer for Data analysis page's Actual analytics data for the device selected */
const projectMetricList = (state = [], action) => {
    switch(action.type) {
        case PROJECT_METRIC_LIST:
            return {
                ...state,
                data: action.data
            };
        case PROJECT_METRIC_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default projectMetricList;