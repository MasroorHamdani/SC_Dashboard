import ApiService from "../services/ApiService";
import {USER_PROFILE} from "../constants/ActionTypes";

function UserDataReceived (data){
    return {
        type: USER_PROFILE,
        data
    }
}
export function profileData(config) {
    return function(dispatch) {
        ApiService(config).then(data => {
            dispatch(UserDataReceived(data.data))
        })
    }
}