import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core';
import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, PROJECT_TABS} from '../../constants/Constant';
import {projectMenuList, projectSubMenuList, projectAnalysisData} from '../../actions/DataAnalysis';
import styles from './DataAvalysisStyle';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';

class DataAnalysis extends Component {
  state = ({
    value: '',
    header: "Devices",
    projectList: '',
    analysisData: ''
  })
  handleChange = event => {
    this.setState({ value: event.target.value });
    const endPoint = `${API_URLS['DEVICE_DATA']}/FARNEK_AQ_TR_T1/${PROJECT_TABS['DATA']}?start=2018120306&end=2018120306`,
      config = getApiConfig(endPoint, 'GET');
    this.props.onDataAnalysis(config, 'subMenu');
  };
  callApi = (value) => {
    let url;
    // if (value === 0 && !this.props.projectData.ProjectTeamDataReducer.data) {
    //   url = PROJECT_TABS['TEAM'];
    // } else if(value === 1 && !this.props.projectData.ProjectDetailsReducer.data) {
    //   url= `${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`;
    // }
    // if(url) {
    // const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.props.data.PID}/${url}`,
    //   config = getApiConfig(endPoint, 'GET');
    // this.props.onDataAnalysisMenu(config, url);
    const endPoint = API_URLS['DASHBOARD'],
    config = getApiConfig(endPoint, 'GET');
    this.props.onDataAnalysisMenu(config);
    // }
  }
  componentDidMount() {
    this.callApi(-1);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.projectList &&
      !isEqual(this.props.projectList, prevProps.projectList)) {
        const responseData = this.props.projectList.DataAnalysisProjectListReducer.data.Projects;
        const project = [];
        let props = this.props,
          projObj = {};
        responseData.map(function(data) {
          const endPoint = `${API_URLS['PROJECT_DETAILS']}/${data.pid}/${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DEVICES']}`,
            config = getApiConfig(endPoint, 'GET');
          props.onDataAnalysisMenu(config, 'subMenu');
          if (props.projectList &&
            !isEqual(props.projectList.DataAnalysisProjectListSubMenuReducer,
              prevProps.projectList.DataAnalysisProjectListSubMenuReducer)) {
                const deviceResponse = props.projectList.DataAnalysisProjectListSubMenuReducer.data;
                let menu = [];
                projObj['id'] = data.pid;
                projObj['name'] = data.name;
                deviceResponse.map(function(deviceData) {
                  deviceData.details.map(function(device) {
                    menu.push(device);
                  });
                });
                projObj['devices'] = menu;
          }
          project.push(projObj);
        });
        if(project[0]['devices']) {
          this.setState({
            projectList: project
          })
        }
      }
      if (this.props.projectList &&
        !isEqual(this.props.projectList.DataAnalysisReducer, prevProps.projectList.DataAnalysisReducer)) {
          const dataAnalysis = this.props.projectList.DataAnalysisReducer.data;
          if(dataAnalysis) {
            this.setState({
              analysisData: dataAnalysis
            })
          }
        }
  }
  
  render () {
    const {classes} = this.props;
      return(
        <div className={classes.root}>
          { this.state.projectList &&
            <RadioButtonComponent data={this.state} projectList={this.state.projectList} handleChange={this.handleChange}/>
          }
          <div className={classes.seperator}></div>
          { this.state.analysisData &&
            <DataAnalysisComponent data={this.state.analysisData}/>
          }
          </div>
          
      )
  }
}

function mapStateToProps(state) {
  return {
      projectList : state,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onDataAnalysisMenu: (config, url) => {
      //will dispatch the async action
      if(url === 'subMenu') {
        dispatch(projectSubMenuList(config))
      } else {
        dispatch(projectMenuList(config))
      }
    },
    onDataAnalysis: (config) => {
      dispatch(projectAnalysisData(config))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DataAnalysis));