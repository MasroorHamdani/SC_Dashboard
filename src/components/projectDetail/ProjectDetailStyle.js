const styles = theme => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
    // root: {
    //     display: 'flex',
    // },
    appBarSpacer: theme.mixins.toolbar,
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
    //Progress Bar
    buttonProgress: {
      width: '100%',
      position: 'absolute',
      right: '0%',
      top: '64px',
    }
});

export default styles;