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
    this.setState({ value,
      loading: true,
      success: false}, function() {
        this.callApi(value);
      });
  };

  callApi = (value) => {
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
    this.callApi(this.state.value);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.projectSelected && 
      !isEqual(this.props.projectSelected, prevProps.projectSelected)){
      if(this.state.pid !== this.props.projectSelected.pid)
        this.setState({pid: this.props.projectSelected.pid},
          function() {
            this.props.history.push(this.props.projectSelected.pid);
            this.info = false;
            this.callApi(this.state.value);
        });
    }
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
        if(this.props.projectData) {
          let association = groupBy(this.props.teamAsso,  'UID');
          let teamMembers = this.props.teamMembers;
          teamMembers.map((row) => {
            let tags = []
            if(association[row.UID])
              association[row.UID].map((dt) => {
                this.props.projectData.map((d) => {
                  if(d.SUB1 === dt.InsID)
                    tags.push([d.name, dt.Level])
                })
              })
            row['Association'] = tags;
          })
          this.setState({teamInfo: teamMembers})
        }
    }
    if(this.state.loading) {
      this.setState({loading: false,
      sucess: true});
    }
  }

  render() {
      const { classes, handleClick } = this.props;
      return (
          <div className={classes.root}>
          {this.state.loading &&
            <LinearProgress className={classes.buttonProgress}/>
          }
          <NamespacesConsumer>
            {
            t=><main className={classes.content}>
            <Paper style={{ padding: 8 * 3 }}>
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
    return {
        onProjectDetailData: (config, url) => {
            //will dispatch the async action
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
// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectDetail));
const ProjectDetailComponent = withStyles(styles)(ProjectDetail);
export default (connect(mapStateToProps, mapDispatchToProps))(withRouter(ProjectDetailComponent));