import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core';
import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, PROJECT_TABS, DATE_TIME_FORMAT,
  ANALYTICS_DATE, ANALYTICS_TAB, DEVICE_METRICS} from '../../constants/Constant';
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
    projectList: [],
    analysisAQData: '',
    start: 0,
    end: 0,
    tab: '',
    pcMetrics: {},
    aqMetrics: {},
    i: 0
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
      const endPoint = `${API_URLS['DEVICE_METRICS']}/${this.state.value}`,
        config = getApiConfig(endPoint, 'GET');
      this.props.onDataAnalysis(config, endPoint, true);
    } else {
      let metrics = [];
      if(this.state.value.includes(ANALYTICS_TAB['ALERT']['key']))
        metrics = this.state.alertMetrics.vector;
      else if(this.state.value.includes(ANALYTICS_TAB['NFC']['key']))
        metrics = this.state.nfcMetrics.vector;
      else if(this.state.value.includes(ANALYTICS_TAB['FD']['key']))
        metrics = this.state.fdMetrics.vector;
      else if(this.state.value.includes(ANALYTICS_TAB['PC']['key']))
        metrics = this.state.pcMetrics.vector;
      else if(this.state.value.includes(ANALYTICS_TAB['AQ']['key']))
        metrics = this.state.aqMetrics.vector;
      else if(this.state.value.includes(ANALYTICS_TAB['WD']['key']))
        metrics = this.state.wdMetrics.vector;

      let dataToPost = {"fn": {}};
      metrics.map((dt) => {
        dataToPost['fn'][dt.path] = dt.statistic;
      })
      const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.value}`,
        params = {'start' : this.state.start, 'end': this.state.end},
        config = getApiConfig(endPoint, 'POST', dataToPost, params);
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
    if ((this.props.projectMenuList || this.props.projectSubMenuList) &&
      (!isEqual(this.props.projectSubMenuList, prevProps.projectSubMenuList) ||
      !isEqual(this.props.projectMenuList, prevProps.projectMenuList))) {
        let responseData = this.props.projectMenuList.Projects,
          project = this.state.projectList,
          projObj = {};
        if(this.state.i <= responseData.length) {
          let data = responseData[this.state.i];
          this.setState({i: this.state.i +1});
          if(data && data.pid) {
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${data.pid}/${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DEVICES']}`,
            config = getApiConfig(endPoint, 'GET');
          this.props.onDataAnalysisMenu(config, 'subMenu');
          }
          if (this.props.projectSubMenuList &&
            !isEqual(this.props.projectSubMenuList, prevProps.projectSubMenuList)) {
                const deviceResponse = this.props.projectSubMenuList;
                let menu = [];
                projObj['id'] = deviceResponse[0].PID;//data.pid;
                projObj['name'] = deviceResponse[0].PID; // data.name;
                let flattedData = _.flatMap(deviceResponse, ({insid, details }) =>
                _.map(details, dt => ({ insid, ...dt }))
                );
                  flattedData.map(function(device) {
                    menu.push(device);
                  });
                projObj['devices'] = menu;
                project.push(projObj);
          }
        }
        if(project[0] && project[0]['devices']) {
          this.setState({
            projectList: project
          })
        }
    }

    if (this.props.dataPCMetrics &&
      !isEqual(this.props.dataPCMetrics, prevProps.dataPCMetrics)){
        const metricsResponse = this.props.dataPCMetrics;
        let pcMetrics = this.getVector(metricsResponse);
        this.setState({pcMetrics: pcMetrics}, function() {
          this.getNewAnalyticsData();
        })
      }
    if (this.props.dataAQMetrics &&
      !isEqual(this.props.dataAQMetrics, prevProps.dataAQMetrics)){
        const metricsResponse = this.props.dataAQMetrics;
        let aqMetrics = this.getVector(metricsResponse);
        this.setState({aqMetrics: aqMetrics}, function() {
          this.getNewAnalyticsData();
        })
    }
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
          color: vector.Color,
          statistic: vector.Statistic
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
            <DataAnalysisComponent data={this.props} stateData={this.state}
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
      projectMenuList : state.DataAnalysisProjectListReducer.data,
      projectSubMenuList : state.DataAnalysisProjectListSubMenuReducer.data,
      dataPCMetrics : state.DataPCMetricsReducer.data,
      dataAQMetrics : state.DataAQMetricsReducer.data,
      dataAQAnalysis : state.DataAQAnalysisReducer.data,
      dataPCAnalysis : state.DataPCAnalysisReducer.data
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
      // } else if (endPoint.includes(ANALYTICS_TAB['FD']['key'])) {
      //   if(isMetrics) {
      //     dispatch(projectFDMetricsData(config))
      //   } else {
      //     dispatch(projectFDAnalysisData(config))
      //   }
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DataAnalysis));