import {blueGrey} from '@material-ui/core/colors';
const styles = theme => ({
    graph: {
        margin: theme.spacing.unit * 4,
        padding: theme.spacing.unit * 4,
        width: '100%',
        height: '100vh',
        overflow: 'auto',
    },
    lineChart: {
        width: "80%",
    },
    select: {
        padding: theme.spacing.unit * 1,
        margin: theme.spacing.unit * 1,
    },
    timeDropper: {
        float: "right",
    },
    seperator: {
        border: "black",
        borderStyle: "double",
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
        alignItems: 'center'
    },
    pointer: {
        cursor: 'pointer'
    },
    //tile dimentions
    tile: {
        width: '160px',
        height: '160px',
        backgroundColor: blueGrey[900],//'#262f3e',//'#404854',
        '& *': { color: 'rgba(255, 255, 255, 0.7)' },
        textAlign: 'center',
        padding: theme.spacing.unit * 2
    }
})

export default styles;