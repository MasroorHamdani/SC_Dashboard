const styles = theme => ({
    graph: {
        margin: theme.spacing.unit * 4,
        padding: theme.spacing.unit * 4,
        width: '100%',
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
    }
})

export default styles;