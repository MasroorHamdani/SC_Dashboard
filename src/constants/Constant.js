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

export const ANALYTICS_TABS = {
    0: 'Alerts',
    1: 'NFC',
    2: 'FD',
    3: 'PC',
    4: 'AQ',
    5: 'WD'
}

export const ANALYTICS_TAB = {
    'ALERT' : {'key': 'Alerts',
                'value': 0,
                'text': 'Alerts'},
    'NFC': {'key': 'NFC',
                'value': 1,
                'text': 'NFC Logs'},
    'FD': {'key': 'FD',
                'value': 2,
                'text': 'Feedback Tablet'},
    'PC': {'key': 'PC',
                'value': 3,
                'text': 'People counting sensor'},
    'AQ':{'key': 'AQ',
                'value': 4,
                'text': 'Air quality sensor'},
    'WD': {'key': 'WD',
                'value': 5,
                'text': 'Wetness Detection sensor'}
}

export const ANALYTICS_DATE = {
    'ONE_HOUR': '1h',
    'THREE_HOUR': '3h',
    'TWELVE_HOUR': '12h',
    'ONE_DAY': '1d',
    'THREE_DAY': '3d',
    'ONE_WEEK': '1w',
    'CUSTOM': 'custom'
}
// process.env.REACT_APP_SECRET_CODE