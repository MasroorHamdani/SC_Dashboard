import React, { Component } from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";
import classNames from 'classnames';
import {AppBar, Toolbar, Badge, IconButton, Typography, withStyles} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import styles from "./HeaderStyle";
import {toolbarClicked}  from '../../actions/MenuAction';

/**
 * Common Header componnet which will be
 * visible to used after they are authenticated
 */
class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: true,
      }
    }
    handleDrawerOpen = () => {
      this.props.onToolbarClick(this.state.open)
    };

    componentDidUpdate(prevProps, prevState) {
      if(this.props.menuState &&
        !isEqual(this.props.menuState, prevProps.menuState)) {
          this.setState({open:this.props.menuState.open})
      }
      if(this.props.ProjectList &&
        !isEqual(this.props.ProjectList, prevProps.ProjectList)) {
          console.log(this.props.ProjectList);
      }
    }
    render() {
      const { classes } = this.props;
      const user = localStorage.getItem('userName');
      return (
          <AppBar
            position="absolute" color="default"
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
                className={classes.title}
                >
                <img src="https://www.smartclean.sg/images/sc-logo.png" alt="logo" className={classes.logo}/>
                <span className={classes.beta}>BETA</span>
              </Typography>
              <Typography
                  component="h6"
                  variant="h6"
                  color="inherit"
                  noWrap
                  className={classes.title}>
                  {user}
                </Typography>
              {/* <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
            </Toolbar>
          </AppBar>
      );
    }
  }
  function mapStateToProps(state) {
    return {
        data : state,
        menuState: state.MenuActionReducer.data,
        ProjectList : state.DashboardReducer.data,
    }
  }
  function mapDispatchToProps(dispatch) {
    return {
        onToolbarClick: (value) => {
            //will dispatch the async action
            dispatch(toolbarClicked(value))
        }
    }
  }
  
  export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));