const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
        // marginTop: theme.spacing.unit * 8,
        display: "flex",
        height: '100vh',
        overflow: 'auto',
    },
    seperator: {
        border: "black",
        borderStyle: "double",
        height: '100vh',
    },
    buttonProgress: {
        width: '100%',
        position: 'absolute',
        right: '0%',
        top: '64px'//'8%',
    },
    content: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 8,
    },
    pageHeader: {
        padding: theme.spacing.unit * 3
    }
})

export default styles;