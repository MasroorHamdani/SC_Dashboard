import React, {Component} from 'react';
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";

import { NamespacesConsumer } from 'react-i18next';
import PropTypes from 'prop-types';
import {isEqual, groupBy} from 'lodash';
import {withStyles, AppBar, Tabs, Tab, Paper,
  LinearProgress, Grid, TextField, Typography,
  FormControl, InputLabel, Select, FormControlLabel,
  Switch} from '@material-ui/core';

import TabContainer from '../tabContainer/TabContainer';
import {PROJECT_TABS, API_URLS, NAMESPACE_MAPPER,
  USER_ROLE, ROLES} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {capitalizeFirstLetter} from '../../utils/FormatStrings';
import {projectDetailData, projectTeamData,
  projectTeamAsso, userCreation} from '../../actions/ProjectDataAction';

import styles from './ProjectDetailStyle';

class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      userDetail: {},
      value: 'team',
      loading: true,
      success: false,
      addNotify: false,
      teamInfo: [],
      authError: '',
      isAuthError: false
    }
    this.state = this.initialState;
    this.info = false;
  }
  
  handleChange = (event, value) => {
  /**
   * On changing the tab selection, this function will be called
   * to get selected tabs data.
   */
    this.setState({ value,
      loading: true,
      success: false}, function() {
        this.callApi(value);
      });
  };

  callApi = (value) => {
    /**
     * Check if selected tab is 'team' or 'installation'
     * depending on that call the appropriate API
     */
    let url;
    if (value === PROJECT_TABS['TEAM']
    // && (!this.props.projectData || !this.state.teamInfo)
    ) {
      url = API_URLS['TEAM_MEMBERS'];
    } else if(value === PROJECT_TABS['INSTALLATION'] 
    // && !this.props.projectData
    ) {
      url= `${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`;
    }
    if(url) {
      const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/${url}`,
        config = getApiConfig(endPoint, 'GET');
      this.props.onProjectDetailData(config, url);
    }
  }

  addDetail = (event) => {
  /***
   * This function will be called to update the state while user selects a new allocation for any member.
   */
      let {name, value} = event.target;
      if (name === 'mute' || name === 'dashboardAccess') {
        value = event.target.checked
      }
      this.setState({
        userDetail: {
          ...this.state.userDetail,
          [name]: value
        }
      })
  }

  filterOnRole = (arr) => {
    if(this.state.projectSelected.Role === ROLES['SUPERVISOR'] || this.state.projectSelected.Role === ROLES['PROJECT_ADMIN'])
      arr = arr.filter(x => (x.key === 'attendent' || x.key === 'supervisor'))
    else if(this.state.projectSelected.Role === ROLES['PARTNER_ADMIN'])
      arr = arr.filter(x => (x.key === 'attendent' || x.key === 'supervisor' || x.key === 'projectadmin'))
    return arr
  }

  handleAddition = () => {
    let additionModal = <div>
        <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="username"
                    name="username"
                    label="Username"
                    placeholder="Username"
                    fullWidth
                    autoComplete="Username"
                    value={this.state.userDetail.username}
                    onChange={this.addDetail}
                    InputLabelProps={{
                        shrink: true
                    }}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="email"
                    name="email"
                    label='Email'
                    fullWidth
                    autoComplete="Email"
                    placeholder="Email"
                    value={this.state.userDetail.email}
                    onChange={this.addDetail}
                    InputLabelProps={{
                        shrink: true
                    }}/>
            </Grid>
            <Grid item xs={6}>
              <Grid
                container
                justify="space-between">
                  <Grid item
                    xs={1}>
                    <TextField
                      required
                      id="countryCode"
                      name="countryCode"
                      label="Code"
                      autoComplete="Code"
                      placeholder="Code"
                      value={this.state.userDetail.countryCode}
                      onChange={this.addDetail}
                      InputLabelProps={{
                        shrink: true
                      }}/>
                  </Grid>
                  <Grid item
                    xs={10}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="phoneNumber"
                      name="phoneNumber"
                      label="Phone Number"
                      autoComplete="Phone Number"
                      placeholder="Phone Number"
                      value={this.state.userDetail.phoneNumber}
                      onChange={this.addDetail}
                      InputLabelProps={{
                        shrink: true
                      }}/>
                  </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControlLabel
                  label='Mute'
                  id="mute"
                  name="mute"
                  control={
                    <Switch
                    checked={this.state.userDetail.mute}
                    onChange={this.addDetail}
                    value="Mute"
                    />}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="fname"
                    name="fname"
                    label="FirstName"
                    placeholder="FirstName"
                    fullWidth
                    autoComplete="FirstName"
                    value={this.state.userDetail.fname}
                    onChange={this.addDetail}
                    InputLabelProps={{
                        shrink: true
                    }}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="lname"
                    name="lname"
                    label="LastName"
                    placeholder="LastName"
                    fullWidth
                    autoComplete="LastName"
                    value={this.state.userDetail.lname}
                    onChange={this.addDetail}
                    InputLabelProps={{
                        shrink: true
                    }}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="desig"
                    name="desig"
                    label="Designation"
                    placeholder="Designation"
                    fullWidth
                    autoComplete="Designation"
                    value={this.state.userDetail.desig}
                    onChange={this.addDetail}
                    InputLabelProps={{
                        shrink: true
                    }}/>
                {/* <FormControl fullWidth>
                    <InputLabel htmlFor="desig">Designation</InputLabel>
                    <Select native
                        value={this.state.userDetail.desig}
                        onChange={this.addDetail}
                        inputProps={{
                            name: 'desig',
                            id: 'desig',
                        }}>
                    <option value="" />
                    {this.filterOnRole(USER_DESIGNATION).map(function(designation) {
                            return <option value={designation.key} name={designation.key} key={designation.key} >
                                {designation.display}</option>
                    })}
                    </Select>
                </FormControl> */}
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="role">Role</InputLabel>
                    <Select native
                        value={this.state.userDetail.role}
                        onChange={this.addDetail}
                        inputProps={{
                            name: 'role',
                            id: 'role',
                        }}>
                    <option value="" />
                    {this.filterOnRole(USER_ROLE).map(function(role) {
                            return <option value={role.key} name={role.key} key={role.key} >
                                {role.display}</option>
                    })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControlLabel
                  label='Dashboard Access'
                  id="dashboardAccess"
                  name="dashboardAccess"
                  control={
                    <Switch
                    checked={this.state.userDetail.dashboardAccess}
                    onChange={this.addDetail}
                    value="Dashboard Access"
                    />}
                />
            </Grid>
            {this.state.errorMessage &&
                <Grid item
                    container
                    alignItems='center'
                    direction='row'
                    justify='flex-end'
                    >
                    <Typography
                        variant="contained"
                        color="secondary"
                        >
                        {this.state.errorMessage}
                    </Typography>
                </Grid>
            }
        </Grid>
    </div>
    this.setState({
      addNotify: !this.state.addNotify,
      additionModal: additionModal,
      addModalHeader: 'Add New User'
    });
  }

  onAddition = () => {
    if(this.state.userDetail.username && this.state.userDetail.fname
      && this.state.userDetail.lname && this.state.userDetail.desig
      && this.state.userDetail.role && this.state.userDetail.countryCode
      && this.state.userDetail.phoneNumber) {
        let dataToPost = {};
        dataToPost['mute'] = this.state.userDetail.mute ? this.state.userDetail.mute : false;
        dataToPost['username'] = this.state.userDetail.username ? this.state.userDetail.username : '';
        dataToPost['email'] = this.state.userDetail.email ?
          this.state.userDetail.email :
          `${this.state.pid}.${this.state.userDetail.username}@mail.com`;
        dataToPost['fname'] = this.state.userDetail.fname ? this.state.userDetail.fname : '';
        dataToPost['lname'] = this.state.userDetail.lname ? this.state.userDetail.lname : '';
        dataToPost['desig'] = this.state.userDetail.desig ? this.state.userDetail.desig : '';
        dataToPost['role'] = this.state.userDetail.role ? this.state.userDetail.role : '';
        dataToPost['dashboard_access'] = this.state.userDetail.dashboardAccess ? this.state.userDetail.dashboardAccess : false;
        dataToPost['phone_number'] = (this.state.userDetail.countryCode && this.state.userDetail.phoneNumber) ?
          `${this.state.userDetail.countryCode}${this.state.userDetail.phoneNumber}` : '';

        let endPoint = `${API_URLS['PROJECT_USER']}/${this.state.pid}`,
            config = getApiConfig(endPoint, 'POST', dataToPost);
        this.props.onUserCreation(config);

        this.setState({
          addNotify: !this.state.addNotify,
          userDetail: {}
        });
    } else {
        this.setState({
          errorMessage: 'Enter All Details'
        })
    }
  }

  componentDidMount() {
  /**
   * Call the API with default tab value.
   */
  if(this.state.pid) {
    this.callApi(this.state.value);
  } else if(this.props.projectSelected){// || localStorage.getItem('projectSelected')) {
    // let dt = JSON.parse(localStorage.getItem('projectSelected'));
    this.setState({
      pid: this.props.projectSelected ? this.props.projectSelected.PID : '',//dt.PID,
      projectSelected : this.props.projectSelected ? this.props.projectSelected : ''//dt
    }, function() {
      this.callApi(this.state.value);
    });
  }
    // this.callApi(this.state.value);
  }

  componentDidUpdate(prevProps, prevState) {
  /**
   * This part will listen to project selection change from the header component.
   * On any change this will be called and the data will be changed in UI
   * Reducer used - 'projectSelectReducer'
   * Set the URL as per the new pid selected and recall the API to get data for new pid.
   */
    if(this.props.projectSelected && 
      !isEqual(this.props.projectSelected, prevProps.projectSelected)){
      if(this.state.pid !== this.props.projectSelected.PID)
        this.setState({
          pid: this.props.projectSelected.PID,
          projectSelected: this.props.projectSelected,
          teamInfo: []
        },
          function() {
            this.props.history.push(this.props.projectSelected.PID);
            this.info = false;
            this.callApi(this.state.value);
        });
    }
  /**
   * This will be part of API called to get the installation list
   * for given/selected project.
   * Process the data, and set in state as well as in cookie, to be used on other place
   */
    if (this.props.projectData &&
      (!isEqual(this.props.projectData, prevProps.projectData) ||
        !this.state.installationData)) {
        const responseData = this.props.projectData;
        let insIDList = [];
        let SUB1;
        responseData.map(function (data) {
          SUB1 = NAMESPACE_MAPPER[data['NS']].SUB1;
          insIDList.push({
            "key": data.SUB1,
            "display": `${data.name} - ${data.locn}`
          })
          data[SUB1] = data.SUB1
        });
        this.setState({installationData: responseData})
        localStorage.setItem('installationLocations', JSON.stringify(insIDList));
    }
    /**
     * This part will get the teams members data as well as
     * the association members have with all locations for give/selected project.
     * Team assocciation API will be call only once, and once association data is returned
     * installition api will be called, which will be captured in above section/part of if consition
     * Group the team association data on UID, which will give dict with UID as key and each UID is per user
     * so per user how many associations are there will be result of groupby.
     * Next the data is processed, and set in state.
     */
    if((this.props.teamMembers || this.props.teamAsso || this.props.projectData) &&
      (!isEqual(this.props.teamMembers, prevProps.teamMembers) ||
      !isEqual(this.props.teamAsso, prevProps.teamAsso) ||
      !isEqual(this.props.projectData, prevProps.projectData))) {
        if(!this.info) {
          const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/${API_URLS['TEAM_ASSOCIATION']}`,
          config = getApiConfig(endPoint, 'GET');
          this.props.onTeamAssociation(config);
          this.info = true;
        }
        if(this.props.teamAsso) {
          const url= `${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`,
            endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/${url}`,
            config = getApiConfig(endPoint, 'GET');
          this.props.onProjectDetailData(config, url); 
        }
        if(this.props.projectData && this.props.teamMembers && this.props.teamAsso &&
          this.props.projectData[0]['PID'] === this.state.pid && this.props.teamAsso[0]['PID'] === this.state.pid) {
          let association = groupBy(this.props.teamAsso,  'UID');
          let teamMembers = this.props.teamMembers;
          
          teamMembers.map((row) => {
            let tags = []
            if(association[row.UID])
              association[row.UID].map((dt) => {
                this.props.projectData.map((d) => {
                  if(d.SUB1 === dt.InsID)
                    tags.push([`${d.name} - ${d.locn} (${capitalizeFirstLetter(dt.Level)})`])
                })
              })
            row['Association'] = tags;
          })
          this.setState({teamInfo: teamMembers})
        }
    }

    /**
     * This part will fetch the User details temporary for recalling the
     * main api again.
     */
    if(this.props.userData && 
      !isEqual(this.props.userData, prevProps.userData)) {
        if(this.props.userData.status && this.props.userData.status === 400) {
          this.setState({
            loading: false,
            authError: this.props.userData.data['Message'],
            isAuthError: true
          });
        } else {
          this.callApi(this.state.value);
        }
    }
    /**
     * Loading progress bar
     */
    if(this.state.loading) {
      this.setState({loading: false});
    }
  }

  handleClose = () => {
    this.setState({
      authError: '',
      isAuthError: false
    })
  };

  render() {
      const { classes, handleClick } = this.props;
      return (
          <div className={classes.root}>
          {/* Progress bar code goes here */}
          {this.state.loading &&
            <LinearProgress className={classes.buttonProgress}/>
          }
          <NamespacesConsumer>
            {
            t=><main className={classes.content}>
            <Paper style={{ padding: 8 * 3 }}>
            {/* Tab bar with options of team and installation */}
                <AppBar position="static" color="default">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth">
                  <Tab label={t('team')}
                    value='team'/>
                  <Tab label={t('installation')}
                    value='installations'/>
                </Tabs>
              </AppBar>
              {this.state.value &&
                <TabContainer data={this.state.installationData}
                  stateData={this.state}
                  category={this.state.value}
                  handleClick={handleClick}
                  handleAddition={this.handleAddition}
                  onAddition={this.onAddition}
                  handleClose={this.handleClose}/>
              }
            </Paper>
          </main>
          }</NamespacesConsumer>
        </div>
      )
  }
}
ProjectDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
      projectData : state.ProjectDetailsReducer.data,
      teamMembers : state.ProjectTeamDataReducer.data,
      teamAsso : state.ProjectTeamAssoDataReducer.data,
      projectSelected : state.projectSelectReducer.data,
      userData : state.UserProfileReducer.data,
  }
}

function mapDispatchToProps(dispatch) {
  //will dispatch the async action
    return {
        onProjectDetailData: (config, url) => {
          if(url === `${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`)
            dispatch(projectDetailData(config))
          else if(url === API_URLS['TEAM_MEMBERS'])
            dispatch(projectTeamData(config))
        },
        onTeamAssociation: (config) => {
          dispatch(projectTeamAsso(config))
        },
        onUserCreation: (config) => {
          dispatch(userCreation(config))
        }
    }
}
// Had to return with - withRouter as ProjectDetail is not being called as part of router from app.js
// So accessing 'props.history' was not working.
const ProjectDetailComponent = withStyles(styles)(ProjectDetail);
export default (connect(mapStateToProps, mapDispatchToProps))(withRouter(ProjectDetailComponent));