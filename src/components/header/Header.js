import React, { Component } from 'react';
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import {isEqual} from "lodash";
import classNames from 'classnames';

import {AppBar, Toolbar, Badge, IconButton, Typography,
  withStyles, FormControl, Select,
MenuItem, Divider, Popper, Paper} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AccountBox from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {NAMESPACE, API_URLS, REACT_URLS} from '../../constants/Constant';

import {toolbarClicked, projectSelect, projectList}  from '../../actions/MenuAction';
import {dashboardData} from '../../actions/DashboardAction';
import {projectAnalysisData} from '../../actions/DataAnalysis';

import { getApiConfig } from '../../services/ApiCofig';

import styles from "./HeaderStyle";
/**
 * Common Header componnet which will be
 * visible to user after they are authenticated
 */
class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: true,
        projectList: [],
        arrowRef: null,
        profileOpen: false,
      }
      this.metricsIndex = 0;
    }
    handleDrawerOpen = () => {
      /**
       * Used for handling the state of the left nav bar.
       */
      this.props.onToolbarClick(this.state.open)
    };

    handleMenu = () => {
    /**
     * This function will handle the state of left profile menu.
     */
      this.setState(state => ({
        profileOpen: !state.profileOpen,
      }));
    };
  
    handleArrowRef = node => {
    /**
     * This function is used to get the node reference for
     * displaying the arrow node for the user menu
     */
      this.setState({
        arrowRef: node,
      });
    };
  
    changeProject = (event) => {
    /**
     * Handle the project selection change in drop down.
     * set the dropdown value and set the state/reducer value
     * so new value will be available through out the app.
     */
      let {name, value} = event.target;
      this.setState({[name]: value});
      this.props.allProjects.map((proj) => {
        if(proj.PID === value)
          this.props.onProjectSelect(proj)
      })
      
    }
  
    onClick = (url) => {
    /**
     * Function to handle the redirection on selecting any link from user menu
     */
      this.handleMenu();
      this.props.history.push(url)
    }
  
    componentDidMount(){
    /**
     * Call get the projects api for logged in user
     */
      const endPoint = API_URLS['DASHBOARD'],
            config = getApiConfig(endPoint, 'GET');
      this.props.onDashbaord(config);
    }
  
    componentDidUpdate(prevProps, prevState) {
    /**
     * Manage the internal state as per the reducer value for left menu value.
     */
      if(this.props.menuState &&
        !isEqual(this.props.menuState, prevProps.menuState)) {
          this.setState({open: this.props.menuState.open})
      }
    /**
     * After the Project list is receiver in reducer.
     * filter the projects as per the namespace,
     * and set in state to be shown on UI.
     * Select the first project as the default one.
     */
      if(this.props.projectList &&
        !isEqual(this.props.projectList, prevProps.projectList) ||
        !this.state.projectList.length > 0) {
          let projData = [];
          if(this.props.projectList.length > 0)
            this.props.projectList.map((row) => {
              if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS'])
                projData.push(row);
            });
          this.setState({
            projectList: projData,
            PID: projData[0].PID
          }, function() {
            this.props.onProjectSelect(projData[0])
            this.props.onProjectList(projData)
          })
      }
    }
    render() {
      const { classes } = this.props;
      const {profileOpen, arrowRef} = this.state;
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
              
              {/* Drop down with Project list and its selection */}
              {(this.state.projectList && this.state.projectList.length > 0) &&
                <FormControl className={classes.formControl}>
                    <Select native
                        value={this.state.PID}
                        onChange={this.changeProject}
                        inputProps={{
                            name: 'PID',
                            id: 'PID',
                            }}>
                    {this.state.projectList.map(function(proj) {
                        return <option value={proj.PID} name={proj.PID} key={proj.PID} >
                            {proj.Site}</option>
                    })}
                    </Select>
                </FormControl>
              }

              {/* Profile Menu Icon Button with options like Profile and logout */}
              <IconButton
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                aria-owns={profileOpen ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit">
                <AccountCircle />
              </IconButton>
              <Popper
                  open={profileOpen}
                  anchorEl={this.anchorEl}
                  placement='bottom'
                  disablePortal={true}
                  className={classes.popper}
                  modifiers={{
                    flip: {
                      enabled: false,
                    },
                    arrow: {
                      enabled: true,
                      element: arrowRef,
                    },
                }}>
                <span className={classes.arrow} ref={this.handleArrowRef} />
                <Paper className={classes.paper}>
                  <MenuItem disabled>{user}</MenuItem>                    
                  <Divider />
                  <MenuItem onClick={e => this.onClick(REACT_URLS['USER-PROFILE'])}>
                    <IconButton><AccountBox /></IconButton>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={e => this.onClick(REACT_URLS['LOGOUT'])}>
                    <IconButton><ExitToAppIcon /></IconButton>
                    Logout
                  </MenuItem>
                </Paper>
              </Popper>
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
  function mapStateToProps(state) {
    return {
        menuState: state.MenuActionReducer.data,
        projectList : state.DashboardReducer.data,
        projectSelected : state.projectSelectReducer.data,
        allProjects : state.projectListReducer.data
    }
  }
  function mapDispatchToProps(dispatch) {
    //will dispatch the async action
    return {
      onToolbarClick: (value) => {
        dispatch(toolbarClicked(value))
      },
      onProjectSelect: (value) => {
        dispatch(projectSelect(value))
      },
      onProjectList: (value) => {
        dispatch(projectList(value))
      },
      onDataAnalysis: (config) => {
        dispatch(projectAnalysisData(config))
      },
      onDashbaord: (config) => {
        dispatch(dashboardData(config))
      },
    }
  }
  
const HeaderComponent = withStyles(styles)(Header);
// Had to return with - withRouter as Header is not being called as part of router from app.js
// So accessing 'props.history' was not working.
export default (connect(mapStateToProps, mapDispatchToProps))(withRouter(HeaderComponent));
