
export const API_END_POINT = process.env.REACT_APP_API_END_POINT
//"https://4l6qi5oh0h.execute-api.ap-southeast-1.amazonaws.com/prod";

export const NEW_API_END_POINT = "https://4l6qi5oh0h.execute-api.ap-southeast-1.amazonaws.com/betaV2"
export const S3_REPORTS_END_POINT = process.env.REACT_APP_S3_REPORTS_END_POINT
//"https://80y6zxl35d.execute-api.ap-southeast-1.amazonaws.com/beta/reports";
export const API_URLS = {
    "LOGIN": "/unauth/login",
    "REFRESH_TOKEN": "/unauth/login",
    "DASHBOARD": "/authV2/projects",
    "PROJECT_DETAILS": "/authV2/projects",
    "FORGOT_PASSWORD": "/unauth/password/change",
    "RESET_PASSWORD": "/unauth/password/confirm",
    "AUTH_RESET_PASSWORD": "/unauth/password/authchallenge",
    "USER_PROFILE": "/authV2/profile",
    // "DEVICE_DATA": "/authV2/devices/data/project",
    "DEVICE_DATA": "/authV2/devices/datatemp/project",
    "NEW_DEVICE_DATA": "/authV2/devices/datanew/analytics/projects",
    "DEVICE_METRICS": "/auth/devices/metrics",
    "SERVICE_REQUIREMENTS": "/auth/algorithms",
    "PROJECT_LOCATION": "/installations/devices",
    "WASHROOM_LOCATION": "/installations/info",
    "PROJECT_ALERT": "/authV2/alerts/projects",
    'TEAM_MEMBERS': 'team/members',
    'TEAM_ASSOCIATION': 'team/assoc',
    'DEFAULT': 'default',
    'INSTALLATION': '/installations',
    'HEALTH': '/health',
    'REPORTING_SERVICE': '/services/reporting',
    'REPORTING_LIST': '/reports',
    'PARTNER': '/unauth/partners/',
    'THEME': '/theme'
};

export const DASHBOARD_METRIC = {
    // "ReqType": "default",
    // "Type": "DASHBOARD",
    // "SubType": "V1"
    "req_type": "DEFAULT",
    "type": "DASHBOARD",
    "sub_type": "V1",
    "all_metrics": []
}
export const NEW_PASSWORD_REQUIRED = "NEW_PASSWORD_REQUIRED";

export const LOGIN_STATUS = {
    "LOGIN": "login",
    "FORGOT": "forgot",
    "RESET": "reset"
}

export const PROJECT_TABS = {
    'INSTALLATION': 'installations',
    'TEAM': 'team',
    'DETAILS': 'info',
    'GENERAL': 'general',
    'DEVICES': 'devices',
    'DATA': 'data',
}

export const SORTING = {
    'ASCENDING': 'asc',
    'DECENDING': 'desc'
}

export const REACT_URLS = {
    'BASEURL': 'optimus',
    'LOGIN': (partnerId) => partnerId ?  `/${partnerId}/login` : '/login',
    'DASHBOARD': (partnerId) => partnerId ? `/${partnerId}/` : '/',
    'PROJECT_DETAILS': (partnerId) => partnerId ? `/${partnerId}/project` :'/project',
    'LOGOUT': (partnerId) => partnerId ? `/${partnerId}/logout` : '/logout',
    'CONTACT': '/contact',
    'ABOUT': '/about',
    'AUTH_RESET': (partnerId) => partnerId ? `/${partnerId}/auth-reset` : '/auth-reset',
    'USER_PROFILE': (partnerId) => partnerId ? `/${partnerId}/profile` :'/profile',
    'ALERT': (partnerId) => partnerId ? `/${partnerId}/alert/project` : '/alert/project',
    'DISPENSER': (partnerId) => partnerId ? `/${partnerId}/dispenser/project` : '/dispenser/project',
    'HEALTH_STATUS': (partnerId) => partnerId ? `/${partnerId}/health/project` : '/health/project'
}
// "ALERT': (partnerId) => partnerId ? `${partnerId}/project/${pid}`: `/project/${pid}`

export const DATE_TIME_FORMAT = 'YYYYMMDDHHmmss'

export const GRAPH_LABEL_TIME_FORMAT = 'HH:mm'

export const GRAPH_LABEL_DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss'

export const HOUR_MIN_FORMAT = 'hh:mm A'

export const HOUR_FORMAT = 'HH:mm'

export const DESCRIPTIVE_DATE_TIME_FORMAT = 'dddd, MMMM Do, YYYY h:mm:ss A'

export const ANALYTICS_DATE = {
    'ONE_HOUR': '1h',
    'THREE_HOUR': '3h',
    'TWELVE_HOUR': '12h',
    'ONE_DAY': '1d',
    'THREE_DAY': '3d',
    'ONE_WEEK': '1w',
    'TODAY': 'Today',
    'CUSTOM': 'custom'
}
// process.env.REACT_APP_SECRET_CODE

export const AUTO_REFRESH_TIMEOUT = 600000; // Time in milliseconds - 10 mins -> 10 * 60 * 1000

export const TIME_LIST = [
    {
        name: "today",
        key: "today",
        value: 6,
        text: "Today"
    },
    {
        name: "last1Hour",
        key: "last1Hour",
        value: 0,
        text: "1h"
    },
    {
        name: "last3Hour",
        key: "last3Hour",
        value: 1,
        text: "3h"
    },
    {
        name: "last12Hour",
        key: "last12Hour",
        value: 2,
        text: "12h"
    },
    {
        name: "last1Day",
        key: "last1Day",
        value: 3,
        text: "1d"
    },
    {
        name: "last3Day",
        key: "last3Day",
        value: 4,
        text: "3d"
    },
    {
        name: "last1Week",
        key: "last1Week",
        value: 5,
        text: "1w"
    }
];

export const FUNCTION_LIST = [
    {
        name: 'Count',
        value: 'count'
    },
    {
        name: 'Sum',
        value: 'sum'
    },
    {
        name: 'Mean',
        value: 'mean'
    }

]
export const REPORT_TABS = {
    'SERVICE' : 'service',
    'LOCATION': 'location',
    'CONFIGURE': 'Configure'
}

export const SERVICES = {
    'USER_SATISFACTION': {
        id: 'sg.smartclean.usersatisfaction',
        display: 'User Satisfaction',
        description: 'This service calculates feedback data metrics for a location.',
        avatar: 'US'
    },
    'ATTENDANT_LOG': {
        id: 1,
        display: 'Attendent Log',
        description: 'This service will get the data for User satisfaction for given date and time for schedule intervals',
        avatar: 'AL'
    },
    'SUPER_VISOR_AUDIT_LOG': {
        id: 2,
        display: 'Super Visor Audit Log',
        description: 'This service will get the data for User satisfaction for given date and time for schedule intervals',
        avatar: 'SVAL'
    },
    'PEAK_TIME': {
        id: 'sg.smartclean.peaktime',
        display: 'Peak Time',
        description: 'This service will get the data for User satisfaction for given date and time for schedule intervals',
        avatar: 'PT'
    },
    'PEOPLE_COUNT': {
        id: 'sg.smartclean.pcanalytics',
        display: 'People Count',
        description: 'This service calculates people density analytics for an installation',
        avatar: 'PC'
    }
}

export const SERVICE_ATTR = {
    'INPUT': 'input',
    'OUTPUT': 'output'
}

export const SERVICE_TABS = {
    'LOCATION': 'locn',
    'DEVICE': 'devid'
}

export const FIELD_TYPE = {
    'STRING': 'string',
    'BOOLEAN': 'boolean',
    
}
export const STRING_FIELD_FORMAT = {
    'TIME': 'HHmm',
    'DROPDOWN': 'dropdown',
    'STRDROPDOWN': 'strdropdown',
    'DELTADAYS': 'DD'
}

export const NAMESPACE = {
    'USER_PROFILE' : 'USER_PROFILE',
    'PROJECT_TEAM_ALLMEMBERS' : 'PROJECT_TEAM_ALLMEMBERS',
    'PROJECT_TEAM_ALLMEMBERS_ASSOC': 'PROJECT_TEAM_ALLMEMBERS_ASSOC'
}

export const NAMESPACE_MAPPER = {
    'USER_PROFILE' : {
        'SUB1': 'RFID',
        'SUB2': 'ID'
    },
    'DEVICE_INFO_GENERAL' : {
        'SUB1': 'insid',
        'SUB2': 'pid'
    },
    'PROJECT_INSTALLATION_INFO' : {
        'SUB1': 'insid',
        'SUB2': 'pid'
    }
}

export const ALERT_STATUS = {
    'not_resolved': 'Not Resovled',
    'pending': 'Pending',
    'resolved': 'Resolved',
    'not_sent': 'Not Sent',
    'blocked': 'Blocked',
    'work_started': 'Work Started',
    'acknowledged': 'Acknowledged'
}

export const METRIC_TYPE = {
    'TIMESERIES' : 'timeseries',
    'CATEGORICAL' : 'categorical',
    'RAW_DATA': 'raw_data',
    'TABLE_DATA': 'table_ver1'
}

export const DATA_VIEW_TYPE = {
    'LINE': 'line',
    'BAR': 'bar',
    'SCATTER': 'scatter',
    'PIE': 'pie',
    'TILE': 'tile',
    'AREA': 'area',
    'VERTICAL': 'vertical'
}

export const ALERT_LEVEL = [
    {key: 'l0',
    display: 'L0'},
    {key: 'l1',
    display: 'L1'},
    {key: 'l2',
    display: 'L2'},
    {key: 'l3',
    display: 'L3'},
    {key: 'l4',
    display: 'L4'}
]

export const PASSWORD_REGEX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,12})");

export const DATA_OPERATIONS = {
    FILTER: 'FILTER',
    RESAMPLER: 'RESAMPLER'
}

export const OPERATION_TYPE = {
    DEFAULT: 'DEFAULT',
    ON_DEMAND: 'ON_DEMAND'
}

export const DEVICE_TOOL_TIP = {
    'ODRDTR': 'Air Quality Devices',
    'PC': 'People Count Devices',
    'PT': 'Paper Towel Devices',
    'WD': 'Wetness Detection Devices',
    'GW': 'Gateway Devices'
}

export const DEVICE_TYPE = {
    'ODRDTR': 'Air Quality Devices',
    'PC': 'People Count Devices',
    'PT': 'Paper Towel Devices',
    'WD': 'Wetness Detection Devices',
    'GW': 'Gateway Devices',
    'TR': 'Toilet Roll Devices'
}

export const RANGE_ERROR = "Please select Range within End Date limits - *Reset the time to Default"

export const THEME = {
    highlighter: '#b7d1b4',
    lighter: '#a9c8a4',
    light: '#8db788',
    main: '#68a554'
}

export const PROJECT_ACTIONS = {
    HOMEPAGE : "PROJECT_HOMEPAGE",
    INSTALLATIONPAGE: "PROJECT_INSTALLATION"
}

export const GRAPH_RENDER_TYPE = {
    COLLATE : 'collate',
    SUBPLOT : 'subplot'
}
