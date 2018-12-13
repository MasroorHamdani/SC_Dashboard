const styles = theme => ({
    graph: {
        margin: theme.spacing.unit * 4,
        padding: theme.spacing.unit * 4,
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
        borderStyle: "double"
    },
    timeList : {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
        cursor: 'pointer'
    }
})

export default styles;