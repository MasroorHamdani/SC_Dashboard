import { combineReducers } from "redux";

import LoginReducer from "./loginReducer";

const reducers = {
    LoginReducer
}

// combines all the reducers which will be passed in Redux Store
const rootReducer = combineReducers(reducers);

export default rootReducer;