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
        // height: '100vh',
        overflow: 'auto',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },

    gridRoot: {
        // display: 'flex',
        // flexWrap: 'wrap',
        // overflow: 'hidden',
        width: '100%'
        // backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        display: 'flex',
        // minHeight: 400,
        width: '100%',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    icon: {
        fontSize: 45,
        cursor: 'pointer'
    },
    card: {
        maxWidth: 400,
        // width: '100% !important'
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
    grid: {
        padding: theme.spacing.unit * 3,
        width: '100%'
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
    divider: {
        margin: '25px'
    },
    hide: {
        display: 'none'
    },
    flexList: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '100%'
    },
    listItem: {
        width: '25%',
        wordBreak: 'break-word'
    },
    deviceDisplay: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    temp: {
        width: '95%'
    }
});

export default styles;