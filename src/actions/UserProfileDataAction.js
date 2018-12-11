import ApiService from "../services/ApiService";
import {USER_PROFILE} from "../constants/ActionTypes";

function UserDataReceived (data){
    return {
        type: USER_PROFILE,
        data
    }
}

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
    }
}