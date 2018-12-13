export const API_END_POINT = "https://4l6qi5oh0h.execute-api.ap-southeast-1.amazonaws.com/prod";
//"https://1w5tcso1ol.execute-api.ap-southeast-1.amazonaws.com/alpha";

export const API_URLS = {
    "LOGIN": "/unauth/login", //"/login-1-time",
    "REFRESH_TOKEN": "/refresh-token",
    "DASHBOARD": "/auth/projects",//"/get-settings",
    "PROJECT_DETAILS": "/auth/projects",//"/get-project",
    "FORGOT_PASSWORD": "/unauth/password/change",//"/forgot-password",
    "RESET_PASSWORD": "/unauth/password/confirm", //"/confirm-forgot-password",
    "AUTH_RESET_PASSWORD": "/unauth/password/authchallenge",
    "USER_PROFILE": "/auth/profile",
    "DEVICE_DATA": "/auth/devices"
};

export const NEW_PASSWORD_REQUIRED = "NEW_PASSWORD_REQUIRED";

export const LOGIN_STATUS = {
    "LOGIN": "login",
    "FORGOT": "forgot",
    "RESET": "reset"
}

export const PROJECT_TABS = {
    'INSTALLATION': 'installations',
    'TEAM': 'team',
    'DETAILS': 'details',
    'GENERAL': 'general',
    'DEVICES': 'devices',
    'DATA': 'data'
}

export const SORTING = {
    'ASCENDING': 'asc',
    'DECENDING': 'desc'
}
//Remove it once it is discarded
export const X_API_KEY = "QcbUJLoJSY2Mj1IdHNgAV6BoArOS6KHa7TlL4Qgx";

export const REACT_URLS = {
    'LOGIN': '/login',
    'DASHBOARD': '/',
    'PROJECT_DETAILS': '/project',
    'LOGOUT': '/logout',
    'CONTACT': '/contact',
    'ABOUT': '/about',
    'AUTH_RESET': "/auth-reset",
    'USER-PROFILE': "/profile"
}

export const DATE_TIME_FORMAT = "YYYYMMDDHHmm"

// process.env.REACT_APP_SECRET_CODE