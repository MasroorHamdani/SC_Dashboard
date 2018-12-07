import { combineReducers } from "redux";

import LoginReducer from "./LoginReducer";
import DashboardReducer from "./DashboardReducer";
import ProjectDataReducer from "./ProjectDataReducer";
import MenuActionReducer from "./MenuActionReducer";
import ForgotPasswordReducer from "./ForgotPasswordReducer";
import ResetPasswordReducer from "./ResetPasswordReducer";
import ProjectDetailsReducer from "./ProjectDataDetailsReducer";
import ProjectTeamDataReducer from './ProjectTeamDataReducer';
import UserProfileReducer from './UserProfileReducer';
import InstallationDeviceReducer from './InstallationDeviceReducer';

const reducers = {
    LoginReducer,
    DashboardReducer,
    ProjectDataReducer,
    MenuActionReducer,
    ForgotPasswordReducer,
    ResetPasswordReducer,
    ProjectDetailsReducer,
    ProjectTeamDataReducer,
    UserProfileReducer,
    InstallationDeviceReducer,
}

// combines all the reducers which will be passed in Redux Store
const rootReducer = combineReducers(reducers);

export default rootReducer;