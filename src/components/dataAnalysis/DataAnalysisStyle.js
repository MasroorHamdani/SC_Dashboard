const styles = theme => ({
    main: {
        width: '80%',
    },
    // Dispenser Data view
    rootDispenser: {
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        width: '100%',
        height: '100vh',
    },
    root: {
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        width: '100%',
    },
    heading: {
        // fontSize: theme.typography.pxToRem(15),
        flexBasis: '90%',
        flexShrink: 0,
    },
    header: {
        // display: 'flex',
        flexWrap: 'wrap'
    }
})

export default styles;