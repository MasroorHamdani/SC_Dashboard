const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        display: "flex",
        height: '100vh',
        overflow: 'auto',
    },
    seperator: {
        border: "black",
        borderStyle: "double"
    }
})

export default styles;