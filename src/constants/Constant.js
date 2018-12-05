export const API_END_POINT = "https://4l6qi5oh0h.execute-api.ap-southeast-1.amazonaws.com/prod";
//"https://1w5tcso1ol.execute-api.ap-southeast-1.amazonaws.com/alpha";

export const API_URLS = {
    "LOGIN": "/unauth/login", //"/login-1-time",
    "REFRESH_TOKEN": "/refresh-token",
    "DASHBOARD": "/auth/projects",//"/get-settings",
    "PROJECT_DETAILS": "/auth/projects",//"/get-project",
    "FORGOT_PASSWORD": "/forgot-password/%s/test",
    "RESET_PASSWORD": "/confirm-forgot-password"
};

export const RESET_PASSWORD_REQUIRED = "NEW_PASSWORD_REQUIRED";

export const LOGIN_STATUS = {
    "LOGIN": "login",
    "FORGOT": "forgot",
    "RESET": "reset"
}

export const PROJECT_TABS = {
    'INSTALLATION': 'installations',
    'TEAM': 'team',
    'SUBSCRIBER': 'subscriber',
    'SETTING': 'setting'
}

export const SORTING = {
    'ASCENDING': 'asc',
    'DECENDING': 'desc'
}
export const X_API_KEY = "QcbUJLoJSY2Mj1IdHNgAV6BoArOS6KHa7TlL4Qgx";

export const REACT_URLS = {
    'LOGIN': '/login',
    'DASHBOARD': '/',
    'PROJECT_DETAILS': '/project',
    'LOGOUT': '/logout',
    'CONTACT': '/contact',
    'ABOUT': '/about',
    'AUTH_RESET': "/auth-reset"
}


// process.env.REACT_APP_SECRET_CODE