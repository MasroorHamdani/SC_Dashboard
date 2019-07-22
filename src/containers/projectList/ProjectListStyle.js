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
    }
});

export default styles;