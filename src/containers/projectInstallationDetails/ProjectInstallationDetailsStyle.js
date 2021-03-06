const styles = theme => ({
    root: {
        display: 'flex',
        width: '100%'
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
    select: {
        padding: theme.spacing.unit * 1,
        margin: theme.spacing.unit * 1,
    },
});

export default styles;