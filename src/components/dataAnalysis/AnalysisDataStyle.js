import {red} from '@material-ui/core/colors';
const styles = theme => ({
    graph: {
        // margin: theme.spacing.unit * 4,
        padding: theme.spacing.unit * 4,
        width: '100%',
        height: '100vh',
        overflow: 'auto',
    },
    select: {
        padding: theme.spacing.unit * 1,
        margin: theme.spacing.unit * 1,
    },
    timeDropper: {
        float: "right",
    },
    seperator: {
        // border: "black",
        // borderStyle: "double",
        marginTop: theme.spacing.unit * 1,
        marginBottom: theme.spacing.unit * 2,
    },
    timeList : {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
        cursor: 'pointer'
    },
    selectedTime: {
        fontWeight: 'bold'
    },
    dateRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    pointer: {
        cursor: 'pointer'
    },
    // Temporary for Dispenser
    root: {
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        width: '100%',
        height: '100vh',
        overflow: 'auto',
    },
    dispenserGraph: {
        width: '100%',
        // height: '100vh',
        overflow: 'auto',
    },
    marginRight: {
        marginRight: theme.spacing.unit
    },
    errorMessage: {
        color: red[500]
    },
    noLeftPadding: {
        paddingLeft: '0px'
    },
    grapPlot: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    modalIniatialDimentions: {
        height: '500px',
    }
})

export default styles;