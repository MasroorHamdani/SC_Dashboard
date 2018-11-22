import axios from 'axios';
import {API_END_POINT} from "../constants/Constant";
import { merge } from "lodash-es";

function ApiService(configObject) {
    const url = API_END_POINT,
        newUrl = `${url}${configObject.url}`;
    const config = merge({}, configObject, {
        headers: { "Authorization": sessionStorage.getItem('IdToken')},
        url: newUrl.replace(/\s/g, "")
    });
    return axios(config)
        .then(response => {
            return Promise.resolve(response);
        })
        .catch(error => {
            const isNotRobot = navigator.userAgent.search("Bot|bot") === -1;
            if (isNotRobot) {
                // Logger.error(`requestObject: ${JSON.stringify(configHeader)}`);
                // Logger.error(error.message);
            }
            if (error.response) {
                const status = error.response.status;
                // The request was made and the server responded with a status code
                if (status === 403) {
                    // Logger.warn("session has been expired");
                } else if (isNotRobot) {
                    // Logger.error(`status : ${status} ${error.response.data}`);
                }
            }
            return Promise.reject(error);
        });
}

export default ApiService;