const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 1,
        marginRight: theme.spacing.unit * 1,
        
        // [theme.breakpoints.up(400 + theme.spacing.unit * 1 * 2)]: {
        //   width: 400,
        //   marginLeft: 'auto',
        //   marginRight: 'auto',
        // },
    },
    content: {
        display: "flex",
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        height: '100vh',
        overflow: 'auto',
    },
    seperator: {
        border: "black",
        borderStyle: "double"
    }
})

export default styles;