import {green} from '@material-ui/core/colors';
const styles = theme => ({
    root: {
      display: 'flex',
      width: '100%'
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 8,
      height: '100vh',
      overflow: 'auto',
      width: '100%'
    },
    gridRoot: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      // width: '100%'
      // backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      minHeight: 400,
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top:'15%',
      right:'1%',
    },
  });

  export default styles;