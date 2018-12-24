import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core';
import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, PROJECT_TABS, DATE_TIME_FORMAT,
  ANALYTICS_DATE, ANALYTICS_TAB} from '../../constants/Constant';
import {projectMenuList, projectSubMenuList, projectAQAnalysisData,
  projectPCAnalysisData, projectPCMetricsData,
  projectAQMetricsData} from '../../actions/DataAnalysis';
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
    tab: '',
    pcMetrics: {},
    aqMetrics: {}
  })
  handleTabChange = (event, value) => {
    this.setState({ tab: value }, function () {
    });
  };

  handleChange = event => {
    this.setState({ value: event.target.value, }, function() {
      if(this.state.value.includes(ANALYTICS_TAB['ALERT']['key']))
        this.setState({ tab: ANALYTICS_TAB['ALERT']['value']});
      else if(this.state.value.includes(ANALYTICS_TAB['NFC']['key']))
        this.setState({ tab: ANALYTICS_TAB['NFC']['value']});
      else if(this.state.value.includes(ANALYTICS_TAB['FD']['key']))
        this.setState({ tab: ANALYTICS_TAB['FD']['value']});
      else if(this.state.value.includes(ANALYTICS_TAB['PC']['key']))
        this.setState({ tab: ANALYTICS_TAB['PC']['value']});
      else if(this.state.value.includes(ANALYTICS_TAB['AQ']['key']))
        this.setState({ tab: ANALYTICS_TAB['AQ']['value']});
      else if(this.state.value.includes(ANALYTICS_TAB['WD']['key']))
        this.setState({ tab: ANALYTICS_TAB['WD']['value']});
      this.handleDateChange(true);
    });
  };

  getNewAnalyticsData = (isMetric) => {
    if (isMetric === true) {
      const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.value}/metrics`,
        config = getApiConfig(endPoint, 'GET');
      this.props.onDataAnalysis(config, endPoint, true);
    } else {
      const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.value}/${PROJECT_TABS['DATA']}?
      start=${this.state.start}&end=${this.state.end}`,
        config = getApiConfig(endPoint, 'GET');
      this.props.onDataAnalysis(config, endPoint);
    }
  }

  handleDateChange = (param='', startDate='', endDate='') => {
    let now = moment(),
      start, end;
    if (param === ANALYTICS_DATE['ONE_HOUR']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 1})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['THREE_HOUR']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 3})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['TWELVE_HOUR']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 12})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['ONE_DAY']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ days: 1})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['THREE_DAY']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ days: 3})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['ONE_WEEK']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ weeks: 1})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['CUSTOM']) {
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
      this.getNewAnalyticsData(param);
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
      !isEqual(this.props.projectList.DataPCMetricsReducer, prevProps.projectList.DataPCMetricsReducer)){
        const metricsResponse = this.props.projectList.DataPCMetricsReducer.data;
        let pcMetrics = this.getVector(metricsResponse);
        this.setState({pcMetrics: pcMetrics}, function() {
          this.getDeviceData();
        })
      }
    if (this.props.projectList &&
      !isEqual(this.props.projectList.DataAQMetricsReducer, prevProps.projectList.DataAQMetricsReducer)){
        const metricsResponse = this.props.projectList.DataAQMetricsReducer.data;
        let aqMetrics = this.getVector(metricsResponse);
        this.setState({aqMetrics: aqMetrics}, function() {
          this.getDeviceData();
        })
    }
  }
  getDeviceData = () => {
    const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.value}/${PROJECT_TABS['DATA']}?
        start=${this.state.start}&end=${this.state.end}`,
      config = getApiConfig(endPoint, 'GET');
      this.props.onDataAnalysis(config, endPoint);
  }

  getVector=(metricsResponse) => {
    let dataMetrics = {};
    metricsResponse.map((metrics) => {
      dataMetrics['MetricType'] = metrics['Data']['MetricType'];
      dataMetrics['vector'] = [];
      metrics.Data.Dimensions.map((vector) => {
        dataMetrics['vector'].push({
          name: vector.Name,
          path: vector.Path,
          unit: vector.Unit,
          shortName: vector.ShortName,
          color: vector.Color
        })
      })
    })
    return dataMetrics
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
    onDataAnalysis: (config, endPoint, isMetrics=false) => {
      if (endPoint.includes(ANALYTICS_TAB['AQ']['key'])) {
        if(isMetrics) {
          dispatch(projectAQMetricsData(config))
        } else {
          dispatch(projectAQAnalysisData(config))
        }
      } else if (endPoint.includes(ANALYTICS_TAB['PC']['key'])) {
        if(isMetrics) {
          dispatch(projectPCMetricsData(config))
        } else {
          dispatch(projectPCAnalysisData(config))
        }
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DataAnalysis));