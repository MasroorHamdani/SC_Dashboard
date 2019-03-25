import React, {Component} from 'react';
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";

import { NamespacesConsumer } from 'react-i18next';
import PropTypes from 'prop-types';
import {isEqual, groupBy} from 'lodash';
import {withStyles, AppBar, Tabs, Tab, Paper,
  LinearProgress} from '@material-ui/core';

import TabContainer from '../tabContainer/TabContainer';
import {PROJECT_TABS, API_URLS, NAMESPACE_MAPPER} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {capitalizeFirstLetter} from '../../utils/FormatStrings';
import {projectDetailData, projectTeamData, projectTeamAsso} from '../../actions/ProjectDataAction';

import styles from './ProjectDetailStyle';

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'team',
      loading: true,
      success: false,
      pid: props.match.params.pid
    };
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
    if (value === 'team' 
    // && (!this.props.projectData || !this.state.teamInfo)
    ) {
      url = API_URLS['TEAM_MEMBERS'];
    } else if(value === 'installation' 
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
  componentDidMount() {
  /**
   * Call the API with default tab value.
   */
    this.callApi(this.state.value);
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
        this.setState({pid: this.props.projectSelected.PID},
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
          insIDList.push(data.SUB1)
          data[SUB1] = data.SUB1
        });
        this.setState({installationData: responseData})
        localStorage.setItem('installationLocations', insIDList);
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
        if(this.props.projectData && this.props.teamMembers) {
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
     * Loading progress bar
     */
    if(this.state.loading) {
      this.setState({loading: false});
    }
  }

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
                  variant="fullWidth"
                >
                  <Tab label={t('team')}
                    value='team'/>
                  <Tab label={t('installation')}
                    value='installation'/>
                </Tabs>
              </AppBar>
              
              {/* Once tab is selected the conditions will decide which section to be disnplayed
              TabContainer is another component */}
              {(this.state.value === 'team' && this.props.teamMembers)&& <TabContainer data={this.props.teamMembers}
                stateData={this.state}
                category={PROJECT_TABS['TEAM']}
                handleClick={handleClick}>Team</TabContainer>}
              {this.state.value === 'installation' && <TabContainer data={this.state.installationData}
                stateData={this.state}
                category={PROJECT_TABS['INSTALLATION']}
                handleClick={handleClick}>Installation</TabContainer>}
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
        }
    }
}
// Had to return with - withRouter as ProjectDetail is not being called as part of router from app.js
// So accessing 'props.history' was not working.
const ProjectDetailComponent = withStyles(styles)(ProjectDetail);
export default (connect(mapStateToProps, mapDispatchToProps))(withRouter(ProjectDetailComponent));