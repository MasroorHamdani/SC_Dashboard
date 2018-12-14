import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core';
import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, PROJECT_TABS, DATE_TIME_FORMAT, ANALYTICS_TABS} from '../../constants/Constant';
import {projectMenuList, projectSubMenuList, projectAQAnalysisData,
  projectPCAnalysisData} from '../../actions/DataAnalysis';
import styles from './DataAvalysisStyle';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';
import moment from 'moment';
import _ from 'lodash';

class DataAnalysis extends Component {
  state = ({
    value: '',
    header: "Devices",
    projectList: '',
    analysisAQData: '',
    start: 0,
    end: 0,
    tab: 3,
  })
  handleTabChange = (event, value) => {
    this.setState({ tab: value }, function () {
    });
  };
  handleChange = event => {
    this.setState({ value: event.target.value, }, function() {
      this.handleDateChange();
    });
  };

  getNewAnalyticsData = () => {
    const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.value}/${PROJECT_TABS['DATA']}?
    start=${this.state.start}&end=${this.state.end}`,
      config = getApiConfig(endPoint, 'GET');
    this.props.onDataAnalysis(config, endPoint);
  }

  handleDateChange = (param='', startDate='', endDate='') => {
    let now = moment(),
      start, end;
    if (param === '1h') {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 1})).format(DATE_TIME_FORMAT);
    } else if(param === '3h') {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 3})).format(DATE_TIME_FORMAT);
    } else if(param === '12h') {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 12})).format(DATE_TIME_FORMAT);
    } else if(param === '1d') {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ days: 1})).format(DATE_TIME_FORMAT);
    } else if(param === '3d') {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ days: 3})).format(DATE_TIME_FORMAT);
    } else if(param === '1w') {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ weeks: 1})).format(DATE_TIME_FORMAT);
    } else if(param === 'custom') {
      end = moment(endDate, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT);
      start = moment(startDate, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT);
    } else {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 1})).format(DATE_TIME_FORMAT);
    }
    this.setState( {
      start: start,
      end: end
    }, function() {
      this.getNewAnalyticsData();
    })
  }
  
  componentDidMount() {
    const endPoint = API_URLS['DASHBOARD'],
    config = getApiConfig(endPoint, 'GET');
    this.props.onDataAnalysisMenu(config);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.projectList &&
      !isEqual(this.props.projectList, prevProps.projectList)) {
        let responseData = []
        if (this.props.projectList.DataAnalysisProjectListReducer &&
          this.props.projectList.DataAnalysisProjectListReducer.data) {
            responseData = this.props.projectList.DataAnalysisProjectListReducer.data.Projects;
        }
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
                let flattedData = _.flatMap(deviceResponse, ({insid, details }) =>
                _.map(details, dt => ({ insid, ...dt }))
                );
                // deviceResponse.map(function(deviceData) {
                  flattedData.map(function(device) {
                    menu.push(device);
                  });
                // });
                projObj['devices'] = menu;
          }
          project.push(projObj);
        });
        if(project[0] && project[0]['devices']) {
          this.setState({
            projectList: project
          })
        }
    }
    if (this.props.projectList &&
      !isEqual(this.props.projectList.DataAQAnalysisReducer, prevProps.projectList.DataAQAnalysisReducer)) {
        const dataAnalysis = this.props.projectList.DataAQAnalysisReducer.data;
        if(dataAnalysis) {
          this.setState({
            analysisAQData: dataAnalysis
          })
        } else {
          this.setState({
            analysisAQData: []
          })
        }
    }
  }
  
  render () {
    const {classes} = this.props;
      return(
        <div className={classes.root}>
          { this.state.projectList &&
            <RadioButtonComponent data={this.state} projectList={this.state.projectList}
              handleChange={this.handleChange}/>
          }
          { this.state.projectList &&
            <div className={classes.seperator}></div>
          }
          { this.state.projectList &&
            <DataAnalysisComponent data={this.props.projectList} stateData={this.state}
              handleDateChange={this.handleDateChange} handleTabChange={this.handleTabChange}/>
          }
          { (!this.state.analysisAQData && !this.state.projectList) &&
            <div>No Projects Assigned</div>
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
    onDataAnalysis: (config, endPoint) => {
      if (endPoint.includes(ANALYTICS_TABS['4']))
        dispatch(projectAQAnalysisData(config))
      else if (endPoint.includes(ANALYTICS_TABS['3']))
        dispatch(projectPCAnalysisData(config))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DataAnalysis));