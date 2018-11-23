import axios from 'axios';
import JWTDecode from 'jwt-decode';
import { merge } from "lodash-es";

// import { AuthApi } from './auth.api';
import { config } from '../config';

import {API_END_POINT} from "../constants/Constant";

function ApiService(configObject) {
    const url = API_END_POINT,
        newUrl = `${url}${configObject.url}`;
    const config = merge({}, configObject, {
        // headers: { "Authorization": sessionStorage.getItem('IdToken')},
        url: newUrl.replace(/\s/g, "")
    });
    axios.defaults.baseURL = API_END_POINT;
    axios.defaults.timeout = 7000;

    const AuthApi = "https://1w5tcso1ol.execute-api.ap-southeast-1.amazonaws.com/alpha/refresh-token";
    axios.interceptors.request.use(
        reqConfig => {
            if (!reqConfig.url.includes('/login'))
                reqConfig.headers.authorization = sessionStorage.getItem('IdToken');
            if (reqConfig.url.includes('/logout'))
                reqConfig.headers['X-REFRESH-TOKEN'] = sessionStorage.getItem(
                    'RefreshToken',
                );
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
        sessionStorage.clear();
        window.location = '/login';
    }

    axios.interceptors.response.use(undefined, err => {
        if (err.response.config.url.includes('/login'))
            return Promise.reject(err);
        if (err.response.status === 403) return forceLogout();
        if (err.response.status !== 401) return Promise.reject(err);
        if (!isFetchingToken) {
            isFetchingToken = true;

            const refreshToken = sessionStorage.getItem('RefreshToken');
            if (!refreshToken) return forceLogout();

            try {
                const isRefreshTokenExpired =
                  JWTDecode(refreshToken).exp < Date.now() / 1000;
          
                if (isRefreshTokenExpired) return forceLogout();
            } catch (e) {
            return forceLogout();
            }
            AuthApi.refreshAccessToken()
                .then(newAccessToken => {
                    isFetchingToken = false;

                    onTokenRefreshed(null, newAccessToken);
                    tokenSubscribers = [];

                    sessionStorage.setItem('IdToken', newAccessToken);
                })
                .catch(() => {
                    onTokenRefreshed(new Error('Unable to refresh access token'), null);
                    tokenSubscribers = [];

                    forceLogout();
                });
        };

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
                    // Logger.warn("session has been expired");
                } else if (isNotRobot) {
                    // Logger.error(`status : ${status} ${error.response.data}`);
                }
            }
            return Promise.reject(error);
        });
}

export default ApiService;