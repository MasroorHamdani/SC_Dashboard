const styles = theme => ({
    root: {
        display: 'flex',
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
          width: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        height: '100vh',
        overflow: 'auto',
    },
    icon: {
        fontSize: 12,
        cursor: 'pointer'
    },
    addIcon: {
        fontSize: 25,
        // float: 'right',
        // marginRight: theme.spacing.unit * 2,
        cursor: 'pointer'
    },
    card: {
        maxWidth: 400,
    },
});

export default styles;