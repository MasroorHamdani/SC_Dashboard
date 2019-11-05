import React, {Component} from "react";
import { connect } from "react-redux";
import {isEqual} from "lodash";
import {withRouter} from "react-router-dom";
import JWTDecode from 'jwt-decode';

import {Drawer, List, Divider, IconButton, withStyles, Typography} from '@material-ui/core';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {toolbarClicked}  from '../../actions/MenuAction';
import styles from "./MenuStyle";
import ListItems from "./ListItems";
import {mainMenuList} from "./MenuList";
import {secondaryMenuList} from "./MenuList";
import {ROLES} from '../../constants/Constant';
import {getTokenData} from '../../utils/FormatStrings';


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      pid: '',
      menu: [],
      partnerid: localStorage.getItem('partnerid')
    }
  }

  handleDrawerClose = () => {
    /**
     * Function to change the left name view - either open or closed.
     * This value is being used in Header component as well,
     * as Menu and Header are working in Sync
     */
    this.props.onToolbarClick(this.state.open);
  };

  componentDidMount() {
    /**
     * Check if pid is present in state or not, if yes get the menu,
     * else set the state first and then get the updated menu
     */
    let idTokenDecoded = JWTDecode(localStorage.getItem('idToken')),
      userData = getTokenData(idTokenDecoded, "Fn");
    if (userData) {
      this.setState({role: userData['R']}, function() {
        if(this.state.pid) {
          this.setState({
            menu: mainMenuList(this.state.pid, this.state.partnerid),
            secondaryMenu: secondaryMenuList(this.state.role, this.state.partnerid)
          });
        } else if(this.props.projectSelected) {
          this.setState({
            pid: this.props.projectSelected.PID,
            menu: mainMenuList(this.props.projectSelected.PID, this.state.partnerid),
            secondaryMenu: secondaryMenuList(this.state.role, this.state.partnerid)
          })
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    /**
     * Get the status of the nav bar - either open or closed.
     * Reducer used - 'MenuActionReducer'
     */
    if(this.props.menuToggleData &&
      !isEqual(this.props.menuToggleData, prevProps.menuToggleData)) {
        this.setState({open:this.props.menuToggleData.open})
    }
    /**
     * Get the project selected details,
     * so the PID will be passed to left menu component
     * to get the relavant path for redirections
     * Reducer usewd - 'projectSelectReducer'
     */
    if(this.props.projectSelected &&
      !isEqual(this.props.projectSelected, prevProps.projectSelected)) {
        if(this.state.role)
          this.setState({
            pid: this.props.projectSelected.PID,
            menu: mainMenuList(this.props.projectSelected.PID, this.state.partnerid),
            secondaryMenu: secondaryMenuList(this.state.role, this.state.partnerid)
          });
    }
  }

  activeRoute =(routeName) =>{
    return this.props.location.pathname === routeName ? true : false;
  }

  render() {
    const { classes } = this.props;

    /**
     * ListItems is a component, which will take the menu list as input and get it displayed.
     * to ge the menu data 'mainMenuList' is being used with pid passed
     * to generate appriopriate path
     */
    return (
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={!this.state.open}>
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItems menuList={this.state.menu} activeRoute={this.activeRoute} menuState={this.state.open}/></List>
          {(this.state.role &&
            (this.state.role === ROLES['PARTNER_ADMIN'] ||
            this.state.role === ROLES['SC_ADMIN'] ||
            this.state.role === ROLES['PROJECT_ADMIN'] ||
            this.state.role === ROLES['SUPERVISOR'])) &&
            <div>
              <Divider />
              <Typography className={classes.header}>Project Management</Typography>
              <List>
                <ListItems menuList={this.state.secondaryMenu} activeRoute={this.activeRoute} menuState={this.state.open}/>
              </List>
            </div>
          }
          <Divider />
          <Typography className={classes.version}>Version 0.04</Typography>
        </Drawer>
    );
  }
};
function mapStateToProps(state) {
  return {
    menuToggleData: state.MenuActionReducer.data,
    projectSelected : state.projectSelectReducer.data
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
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(Menu)));