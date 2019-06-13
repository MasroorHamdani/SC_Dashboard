import _ from "lodash";

import { PROJECT_ANALYSIS_DATA, PROJECT_ANALYSIS_INITIALISE} from '../constants/ActionTypes';

/* Reducer for Data analysis page's Actual analytics data for the device selected */
const dataAnalysis = (state = [], action) => {
    switch(action.type) {
        case PROJECT_ANALYSIS_DATA:
            if(state.data) {
                let stateMetricValue = state.data.data.data.metrics,
                    newMetricValue = action.data.data.data.metrics,
                    allMetricsValue = state.data.data.data.all_metrics.concat(action.data.data.data.all_metrics);
                return{
                    ...state,
                    data: {
                        ...state.data,
                        data: {
                            ...state.data.data,
                            data: {
                                ...state.data.data.data,
                                metrics: {...stateMetricValue, ...newMetricValue},
                                all_metrics: allMetricsValue
                            }
                        }
                    }
                };
            }
            else {
                return {
                    ...state,
                    data: action.data
                }
            }
        case PROJECT_ANALYSIS_INITIALISE:
            return action.data
        default:
            return state
    }
};

export default dataAnalysis;