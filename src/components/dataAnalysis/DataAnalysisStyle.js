import {grey, yellow, green, orange, red} from '@material-ui/core/colors';
const styles = theme => ({
    main: {
        width: '80%',
    },
    // Dispenser Data view
    root: {
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        width: '100%',
        height: '100vh',
    },
    // root: {
    //     padding: theme.spacing.unit * 3,
    //     marginTop: theme.spacing.unit * 8,
    //     width: '100%',
    // },
    expansionRoot: {
        backgroundColor: grey[300],
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
    },
    pending: {
        color: '#fff',
        backgroundColor: yellow[700],
        padding:'0px !important'
    },
    resolved: {
        color: '#fff',
        backgroundColor: green[500],
        padding:'0px !important'
    },
    blocked: {
        color: '#fff',
        backgroundColor: red[500],
        padding:'0px !important'
    },
    not_resolved: {
        color: '#fff',
        backgroundColor: orange[300],
        padding:'0px !important'
    },
    not_sent: {
        padding:'0px !important'
    },
    content: {
        flexBasis: '15%',
        flexShrink: 0,
    },
})

export default styles;