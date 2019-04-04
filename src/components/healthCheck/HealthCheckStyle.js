import {orange, green, red} from '@material-ui/core/colors';
const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        height: '100vh',
        overflow: 'auto',
    },
    unhealthy: {
        backgroundColor: red[500],
        height: '10px',
        // width: '50px'
    },
    warning: {
        backgroundColor: orange[500],
        height: '10px',
        // width: '50px'
    },
    healthy: {
        backgroundColor: green[500],
        height: '10px',
        // width: '50px'
    },
    statusBar: {
        display: 'flex'
    },
    bottomPadding: {
        paddingBottom: theme.spacing.unit * 3
    },
    unhealthyStatus: {
        backgroundColor: red[500],
        width: '35%'
    },
    warningStatus: {
        backgroundColor: orange[500],
        width: '35%'
    },
    healthyStatus: {
        backgroundColor: green[500],
        width: '35%'
    },
    buttonProgress: {
        width: '100%',
        position: 'absolute',
        right: '0%',
        top: '64px'
    },
});

export default styles;