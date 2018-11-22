import { combineReducers } from "redux";

import LoginReducer from "./loginReducer";
import DashboardReducer from "./dashboardReducer";

const reducers = {
    LoginReducer,
    DashboardReducer
}

// combines all the reducers which will be passed in Redux Store
const rootReducer = combineReducers(reducers);

export default rootReducer;