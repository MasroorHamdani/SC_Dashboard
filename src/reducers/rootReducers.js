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
import DataAnalysisInstallationListReducer from './DataAnalysisInstallationListReducer';
import DataAnalysisProjectListSubMenuReducer from './DataAnalysisProjectSubMenuReducer';
import DataAnalysisReducer from './DataAnalysisReducer';
import ServiceRequirementReducer from './ServiceRequirementReducer';
import ProjectAlertReducer from './ProjectAlertReducer';
import DispenserDataReducer from './DispenserDataReducer';
import ProjectTeamAssoDataReducer from './ProjectTeamAssoDataReducer';
import projectSelectReducer from './ProjectSelectReducer';
import projectListReducer from './ProjectListReducer';
import HealthStatusReducer from './HealthStatusReducer';
import HealthtSatusLocationSReducer from './HealthStatusLocationReducer';
import ReportsListReducer from './ReportsListReducer';
import ModalDataAnalysisReducer from './ModalDataAnalysisReducer';
import PartnerThemeReducer from './PartnerThemeReducer';
import AdminReducer from './AdminReducer';

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
    DataAnalysisInstallationListReducer,
    DataAnalysisProjectListSubMenuReducer,
    DataAnalysisReducer,
    ServiceRequirementReducer,
    ProjectAlertReducer,
    DispenserDataReducer,
    ProjectTeamAssoDataReducer,
    projectSelectReducer,
    projectListReducer,
    HealthStatusReducer,
    HealthtSatusLocationSReducer,
    ReportsListReducer,
    ModalDataAnalysisReducer,
    PartnerThemeReducer,
    AdminReducer
}

// combines all the reducers which will be passed in Redux Store
const rootReducer = combineReducers(reducers);

export default rootReducer;