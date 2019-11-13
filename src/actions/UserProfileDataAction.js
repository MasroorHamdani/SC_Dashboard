import ApiService from "../services/ApiService";
import {USER_PROFILE, USER_PROFILE_UPDATE} from "../constants/ActionTypes";

/**
 * Dispatched function to call the API service to get
 * the Logged in User details - Which includes: 
 * firstname, lastname, phone number etc
 * @param {*} config 
 */
export function profileData(config) {
    return function(dispatch) {
        ApiService(config).then(data => {
            dispatch(UserDataReceived(data.data))
        })
        .catch(error => {
            dispatch(UserDataReceived(error))
        })
    }
}
function UserDataReceived (data){
    return {
        type: USER_PROFILE,
        data
    }
}

/**
 * Dispatched function to call the API service to Update
 * the logged in User details - Which includes: 
 * firstname, lastname, phone number etc
 * @param {*} config 
 */
export function profileDataUpdate(config) {
    return function(dispatch) {
        ApiService(config).then(data => {
            dispatch(UserDataUpdated(data.data))
        })
        .catch(error => {
            dispatch(UserDataUpdated(error))
        })
    }
}

function UserDataUpdated (data){
    return {
        type: USER_PROFILE_UPDATE,
        data
    }
}
