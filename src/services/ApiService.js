import axios from 'axios';
import { merge } from "lodash-es";

import {API_END_POINT, API_URLS, REACT_URLS} from "../constants/Constant";

function ApiService(configObject) {
    const url = API_END_POINT,
        newUrl = `${url}${configObject.url}`;
    const config = merge({}, configObject, {
        url: newUrl.replace(/\s/g, "")
    });
    axios.defaults.baseURL = API_END_POINT;
    axios.defaults.timeout = 7000;

    axios.interceptors.request.use(
        reqConfig => {
            if (!reqConfig.url.includes(REACT_URLS['LOGIN']))
                reqConfig.headers.authorization = localStorage.getItem('idToken');
            return reqConfig;
        },
        err => Promise.reject(err),
    );
    let isFetchingToken = false,
        tokenSubscribers = [];
    function subscribeTokenRefresh(cb) {
        tokenSubscribers.push(cb);
    }
    function onTokenRefreshed(errRefreshing, token) {
        tokenSubscribers.map(cb => cb(errRefreshing, token));
    }
    function forceLogout() {
        isFetchingToken = false;
        localStorage.clear();
        localStorage.setItem('previousPath', window.location.pathname);
        window.location = REACT_URLS['LOGIN'];
    }

    axios.interceptors.response.use(undefined, err => {
        if (err.response) {
            if (err.response.config.url.includes(REACT_URLS['LOGIN']))
                return Promise.reject(err);
            if (err.response.status === 403) return forceLogout();
            if (err.response.status !== 401) return Promise.reject(err);
            if (err.response.status === 500) return Promise.reject(err);
        }
        // if (!err.response) return Promise.reject(err);
        if (!isFetchingToken) {
            isFetchingToken = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return forceLogout();

            const urlEndPoint = `${API_END_POINT}${API_URLS['REFRESH_TOKEN']}`,
                dataToPost = {
                    rtoken: refreshToken
                }
            axios({
                method:'POST',
                url: urlEndPoint,
                headers: {'Content-Type':'application/json'
                },
                data: JSON.stringify(dataToPost)
            })
            .then(function(data) {
                isFetchingToken = false;
                let newAccessToken = data.data.AuthenticationResult.IdToken;
                onTokenRefreshed(null, newAccessToken);
                tokenSubscribers = [];
                localStorage.setItem('idToken', newAccessToken);
            })
            .catch((err) => {
                onTokenRefreshed(new Error('Unable to refresh access token'), null);
                tokenSubscribers = [];
                forceLogout();
            });
        }
        const initTokenSubscriber = new Promise((resolve, reject) => {
            subscribeTokenRefresh((errRefreshing, newToken) => {
                if (errRefreshing) return reject(errRefreshing);
                err.config.headers.authorization = newToken;
                return resolve(axios(err.config));
            });
        });
        return initTokenSubscriber;
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
                    // console.log(error.response, "403 error");
                    // Logger.warn("session has been expired");
                } else if (status === 400) {
                    // Return request for any user Error, with status 400
                    return Promise.reject(error.response);
                } else if (isNotRobot) {
                    // Logger.error(`status : ${status} ${error.response.data}`);
                }
            }
            return Promise.reject(error);
        });
}

export default ApiService;