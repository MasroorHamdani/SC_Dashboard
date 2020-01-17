const styles = theme => ({
    root: {
        // display: 'flex',
        width: '85%'//'100%'
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
    group: {
        padding: theme.spacing.unit * 1,
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    seperator: {
        border: "black",
        borderStyle: "double",
        height: '100vh',
    },
    radioRoot: {
        width: "21%",//'251px',//"23%",
        maxWidth: 360,
        wordBreak: 'break-word',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        position: 'relative',
        maxHeight: 'auto',
    },
    //Progress Bar
    buttonProgress: {
        width: '100%',
        position: 'absolute',
        right: '0%',
        top: '64px',
    },
    error: {
        color: theme.palette.error.dark,
        display :'flex',
        justifyContent: 'center',
        paddingTop: theme.spacing.unit * 2
    },
});

export default styles;