import {grey, yellow, green, orange, red} from '@material-ui/core/colors';
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
        backgroundColor: yellow[700],
        padding:'0px !important',
        flexBasis: '10%'
    },
    resolved: {
        color: '#fff',
        backgroundColor: green[500],
        padding:'0px !important',
        flexBasis: '10%'
    },
    blocked: {
        color: '#fff',
        backgroundColor: red[500],
        padding:'0px !important',
        flexBasis: '10%'
    },
    not_resolved: {
        color: '#fff',
        backgroundColor: orange[300],
        padding:'0px !important',
        flexBasis: '10%'
    },
    not_sent: {
        padding:'0px !important',
        flexBasis: '10%'
    },
    content: {
        flexBasis: '15%',
        flexShrink: 0,
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
})

export default styles;