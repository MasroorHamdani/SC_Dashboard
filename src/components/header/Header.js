import React, { Component } from 'react';
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import {isEqual} from "lodash";

import classNames from 'classnames';
import {AppBar, Toolbar, Badge, IconButton, Typography,
  withStyles, FormControl, Select, Menu,
MenuItem, Divider} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AccountBox from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {NAMESPACE, API_URLS, REACT_URLS} from '../../constants/Constant';


import {toolbarClicked, projectSelect}  from '../../actions/MenuAction';
import {dashboardData} from '../../actions/DashboardAction';
import {projectAnalysisData} from '../../actions/DataAnalysis';

import { getApiConfig } from '../../services/ApiCofig';

import styles from "./HeaderStyle";
/**
 * Common Header componnet which will be
 * visible to used after they are authenticated
 */
class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: true,
        anchorEl: null,
        projectList: []
      }
      this.metricsIndex = 0;
    }
    handleDrawerOpen = () => {
      this.props.onToolbarClick(this.state.open)
    };

    changeProject = (event) => {
      let {name, value} = event.target;
      this.setState({[name]: value});
      this.props.onProjectSelect(value)
    }

    handleMenu = event => {
      this.setState({ anchorEl: event.currentTarget });
    };
  
    handleClose = () => {
      this.setState({ anchorEl: null });
    };
  
    onClick = (url) => {
      this.handleClose();
      this.props.history.push(url)
    }
  
    componentDidMount(){
      const endPoint = API_URLS['DASHBOARD'],
            config = getApiConfig(endPoint, 'GET');
      this.props.onDashbaord(config);
    }
  
    componentDidUpdate(prevProps, prevState) {
      if(this.props.menuState &&
        !isEqual(this.props.menuState, prevProps.menuState)) {
          this.setState({open: this.props.menuState.open})
      }
      if(this.props.ProjectList &&
        !isEqual(this.props.ProjectList, prevProps.ProjectList) ||
        !this.state.projectList.length > 0) {
          let projData = [];
          if(this.props.ProjectList.length > 0)
            this.props.ProjectList.map((row) => {
              if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS'])
                projData.push(row);
                localStorage.setItem(row.PID, row.Region);
            });
          this.setState({
            projectList: projData,
            PID: projData[0].PID
          }, function() {
            this.props.onProjectSelect(projData[0].PID)
          })
      }
    }
    render() {
      const { classes } = this.props;
      const profileOpen = Boolean(this.state.anchorEl);
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
              <IconButton
                  aria-owns={profileOpen ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
              </IconButton>
              <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={profileOpen}
                  onClose={this.handleClose}>
                  <MenuItem disabled>{user}</MenuItem>
                  <Divider />
                  <MenuItem onClick={e => this.onClick(REACT_URLS['USER-PROFILE'])}>
                    <IconButton><AccountBox/></IconButton>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={e => this.onClick(REACT_URLS['LOGOUT'])}>
                    <IconButton><ExitToAppIcon/></IconButton>
                    Logout
                  </MenuItem>
              </Menu>
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
        ProjectList : state.DashboardReducer.data,
        projectSelected : state.projectSelectReducer.data,
    }
  }
  function mapDispatchToProps(dispatch) {
    return {
        onToolbarClick: (value) => {
            //will dispatch the async action
            dispatch(toolbarClicked(value))
        },
        onProjectSelect: (value) => {
          //will dispatch the async action
          dispatch(projectSelect(value))
        },
        onDataAnalysis: (config) => {
          dispatch(projectAnalysisData(config))
        },
        onDashbaord: (config) => {
          dispatch(dashboardData(config))
      },
    }
  }
  
// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));

const HeaderComponent = withStyles(styles)(Header);
export default (connect(mapStateToProps, mapDispatchToProps))(withRouter(HeaderComponent));