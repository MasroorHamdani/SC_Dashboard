import { combineReducers } from "redux";

import LoginReducer from "./LoginReducer";
import DashboardReducer from "./DashboardReducer";
import ProjectDataReducer from "./ProjectDataReducer";
import MenuActionReducer from "./MenuActionReducer";

const reducers = {
    LoginReducer,
    DashboardReducer,
    ProjectDataReducer,
    MenuActionReducer
}

// combines all the reducers which will be passed in Redux Store
const rootReducer = combineReducers(reducers);

export default rootReducer;