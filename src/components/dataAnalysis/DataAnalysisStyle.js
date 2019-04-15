import {grey, yellow, green, blue, red, blueGrey} from '@material-ui/core/colors';
const styles = theme => ({
    main: {
        width: '80%',
    },
    // Alert Data view
    root: {
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        width: '100%',
        height: '100vh',
        overflow: 'auto',
    },
    dashboardRoot: {
        width: '100%',
        height: '400px',
        overflow: 'auto',
    },
    expansionRoot: {
        backgroundColor: grey[200],
        borderBottom: '1px solid rgba(0,0,0,.125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    heading: {
        // fontSize: theme.typography.pxToRem(15),
        flexBasis: '85%',
        flexShrink: 0,
        textAlign: 'left'
    },
    pending: {
        color: '#fff',
        height: '25px',
        backgroundColor: yellow[700],
        padding:'0px !important',
        flexBasis: '10%'
    },
    resolved: {
        color: '#fff',
        height: '25px',
        backgroundColor: green[500],
        padding:'0px !important',
        flexBasis: '10%'
    },
    blocked: {
        color: '#fff',
        height: '25px',
        backgroundColor: blue[500],
        padding:'0px !important',
        flexBasis: '10%'
    },
    not_resolved: {
        color: '#fff',
        height: '25px',
        backgroundColor: red[500],
        padding:'0px !important',
        flexBasis: '10%'
    },
    not_sent: {
        height: '25px',
        padding:'0px !important',
        flexBasis: '10%'
    },
    content: {
        flexBasis: '15%',
        flexShrink: 0,
    },
    custimeDateRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '16px',
        marginLeft: '0px'
    },

    //Dispenser date picker
    dateRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '35%',
        margin: '16px',
        marginLeft: '0px'
    },
    //Dispenser Model
    graph: {
        margin: theme.spacing.unit * 4,
        padding: theme.spacing.unit * 4,
        width: '100%',
        height: '100vh',
        overflow: 'auto',
    },
    // Progress bar
    buttonProgress: {
        width: '100%',
        position: 'absolute',
        right: '0%',
        top: '64px'
    },
    // Alerts Filter drop down
    formControl: {
        // margin: theme.spacing.unit,
        minWidth: 120,
    },
    margin: {
        margin: theme.spacing.unit,
    },
    marginRight: {
        marginRight: theme.spacing.unit
    },
    // Grap Plot CSS
    alertBox: {
        width: '55%'
    },
    otherData: {
        width: '45%'
    },
    errorMessage: {
        color: red[500]
    },
    seperator: {
        marginTop: theme.spacing.unit * 1,
        marginBottom: theme.spacing.unit * 2,
    },
    //Line chart dimentions
    lineChart: {
        width: "80%",
    },
    //tile dimentions
    tile: {
        // width: '160px',
        // height: '160px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: blueGrey[900],//'#262f3e',//'#404854',
        '& *': { color: 'rgba(255, 255, 255, 0.7)' },
        textAlign: 'center',
        padding: theme.spacing.unit * 2
    },

})

export default styles;