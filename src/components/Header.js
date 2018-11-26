import React, { Component } from 'react';
// import { connect } from "react-redux";
import { NamespacesConsumer } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import "./../sass/Header.css";

const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  }
});
class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: true,
      }
    }

    handleDrawerOpen = () => {
      this.setState({ open: true });
    };
    render() {
      const { classes } = this.props;
      // console.log(this.store);
      
      const user = "Masroor";
      return (
        // <div className="Header">
        //   <NamespacesConsumer>
        //   {
        //     t => <h1>{t('Welcome-Header')} {user}</h1>
        //   }
        //   </NamespacesConsumer>
        //   {/* <div>
        //     {this.props.token}
        //   </div> */}
        // </div>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
          <Toolbar  className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}>
                <MenuIcon />
              </IconButton>
               <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}>
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
      );
    }
  }
  
  
  // export default Header;
  export default withStyles(styles)(Header);
  // export default connect(mapStateToProps)(Header)