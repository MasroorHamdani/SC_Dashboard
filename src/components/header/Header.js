import React, { Component } from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";
import { NamespacesConsumer } from 'react-i18next';
import classNames from 'classnames';
import {AppBar, Toolbar, Badge, IconButton, Typography, withStyles} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import styles from "./HeaderStyle";
import {toolbarClicked}  from '../../actions/MenuAction';

class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: true,
        userName:''
      }
    }
    handleDrawerOpen = () => {
      this.props.onToolbarClick(this.state.open)
    };

    componentDidUpdate(prevProps, prevState) {
      if(this.props.data.MenuActionReducer &&
        !isEqual(this.props.data.MenuActionReducer,prevProps.data.MenuActionReducer)) {
          console.log(this.props.data.MenuActionReducer, "header data menu");
          this.setState({open:this.props.data.MenuActionReducer.data.open})
        }
      if(this.props.data.LoginReducer &&
        !isEqual(this.props.data.LoginReducer, prevProps.data.LoginReducer)) {
          console.log(this.props.data.LoginReducer, "header login");
          this.setState({userName:this.props.data.LoginReducer.data.user})
        }
    }
    render() {
      const { classes } = this.props;
      const user = "Masroor";
      return (
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
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}>
                {user}
                </Typography>
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
      );
    }
  }
  function mapStateToProps(state) {
    return {
        data : state
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