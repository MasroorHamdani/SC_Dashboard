const drawerWidth = 240;
const styles = theme => ({
  drawerPaper: {
    color: `${theme.palette.primary.textcolor}`,
    position: 'relative',
    whiteSpace: 'nowrap',
    // height: '100vh',
    backgroundColor: `${theme.palette.primary.lighter}`,//'#a9c8a4',
    // '& *': { color: 'rgba(255, 255, 255, 0.7)' },
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  isActive: {
    boxShadow: '0 12px 20px -10px rgba(0, 172, 193,.28), 0 4px 20px 0 rgba(0, 0, 0,.12), 0 7px 8px -5px rgba(0, 172, 193,.2)',
    backgroundColor: `${theme.palette.primary.highlighter} !important`, //'#b7d1b4 !important',
    // '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.0)'},
    // '&:focus': { backgroundColor: 'rgba(0, 0, 0, 0.0)' }
  },
  drawerPaperClose: {
    color: `${theme.palette.primary.textcolor}`,
    // height: '100vh',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  version :{
    paddingLeft: '70px',//'80px'
    color: `${theme.palette.primary.textcolor}`,
    opacity: '0.5',
  },
  header: {
    paddingLeft: '70px',
    opacity: '0.5',
    color: `${theme.palette.primary.textcolor}`,
  },
  textFontColor: {
    color: `${theme.palette.primary.textcolor}`,
    fontSize: ".85rem"
  },
  whiteFont: {
    color: `${theme.palette.primary.textcolor}`
  },
  listPaddingMenu: {
    paddingLeft: theme.spacing.unit * 2,
    textDecoration: 'none',
    paddingTop: theme.spacing.unit,
    paddingTop: theme.spacing.unit
  },
  flexDisplay: {
    display: 'flex'
  },
  anchorIsActive: {
    '&:hover': { backgroundColor: `${theme.palette.primary.highlighter} !important`},
  }
});

export default styles;