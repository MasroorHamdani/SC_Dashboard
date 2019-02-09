import React, {Component} from 'react';
import { connect } from "react-redux";
import styles from './ProjectDetailStyle';
import {withStyles, AppBar, Tabs, Tab, Paper} from '@material-ui/core';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';
import TabContainer from '../tabContainer/TabContainer';
import {PROJECT_TABS, API_URLS, NAMESPACE_MAPPER} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectDetailData, projectTeamData} from '../../actions/ProjectDataAction';
import { NamespacesConsumer } from 'react-i18next';

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
    };
  }
  
  handleChange = (event, value) => {
    this.setState({ value });
    this.callApi(value);
  };

  callApi = (value) => {
    let url;
    if (value === 0 && !this.props.projectData) {
      url = PROJECT_TABS['TEAM_MEMBERS'];
    } else if(value === 1 && !this.props.projectData) {
      url= `${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`;
    }
    if(url) {
      const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.props.stateData.pid}/${url}`,
        config = getApiConfig(endPoint, 'GET');
      this.props.onProjectDetailData(config, url);
    }
  }
  componentDidMount() {
    this.callApi(0);
  }

  componentDidUpdate(prevProps, prevState) {
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
  }

  render() {
      const { classes, handleClick } = this.props;
      return (
          <div className={classes.root}>
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
                  fullWidth
                >
                  <Tab label={t('team')} />
                  <Tab label={t('installation')} />
                </Tabs>
              </AppBar>
              
              {(this.state.value === 0 && this.props.teamMembers)&& <TabContainer data={this.props.teamMembers}
                category={PROJECT_TABS['TEAM']}
                handleClick={handleClick}>Team</TabContainer>}
              {this.state.value === 1 && <TabContainer data={this.state.installationData}
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
  }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectDetailData: (config, url) => {
            //will dispatch the async action
            if(url === `${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`)
              dispatch(projectDetailData(config))
            else if(url === PROJECT_TABS['TEAM_MEMBERS'])
              dispatch(projectTeamData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectDetail));