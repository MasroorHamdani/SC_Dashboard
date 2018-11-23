import { combineReducers } from "redux";

import LoginReducer from "./loginReducer";
import DashboardReducer from "./dashboardReducer";
import ProjectDataReducer from "./projectDataReducer";

const reducers = {
    LoginReducer,
    DashboardReducer,
    ProjectDataReducer
}

// combines all the reducers which will be passed in Redux Store
const rootReducer = combineReducers(reducers);

export default rootReducer;