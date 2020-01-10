const styles = theme => ({
    root: {
        // display: 'flex',
        overflow: 'auto',
        height: '100vh',
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
    pageName: {
        paddingLeft: theme.spacing.unit * 3
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        // height: '100vh',
        overflow: 'auto',
    },
    icon: {
        fontSize: 45,
        cursor: 'pointer'
    },
    card: {
        maxWidth: 400,
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
    grid: {
        padding: theme.spacing.unit * 3
    },
    seperator: {
        // marginTop: theme.spacing.unit * 1,
        marginBottom: theme.spacing.unit * 2,
    },
    formControl: {
        // margin: theme.spacing.unit,
        minWidth: 120,
    },
    iconButton: {
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.7)' }
    },
    buttonProgress: {
        width: '100%',
        position: 'absolute',
        right: '0%',
        top: '64px'
      },
});

export default styles;