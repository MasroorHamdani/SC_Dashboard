import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core';

import moment from 'moment';
import _ from 'lodash';

import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, PROJECT_TABS, DATE_TIME_FORMAT,
  ANALYTICS_DATE, ANALYTICS_TAB, DEVICE_METRICS, ANALYTICS_SUB_TABS} from '../../constants/Constant';
import {projectMenuList, projectSubMenuList, projectAQAnalysisData,
  projectPCAnalysisData, projectPCMetricsData,
  projectAQMetricsData} from '../../actions/DataAnalysis';
import styles from './DataAvalysisStyle';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';
import AlertAnalysis from '../../components/dataAnalysis/AlertAnalysis';
import DispenserAnalysis from '../../components/dataAnalysis/DispenserAnalysis';

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
    i: 0,
    sampling: '',
    unit: '',
    func: '',
    page: ''
  })
  handleTabChange = (event, value) => {
    this.setState({ tab: value }, function () {
    });
  };

  handleSelect = (event) => {
    this.setState({page: event})
  }
  handleChange = event => {
    this.setState({ value: event.target.value,
                    page: ANALYTICS_SUB_TABS['INSTALLATION_DETAILS']['key']},
                    function() {
      if(this.state.value.includes(ANALYTICS_TAB['FD']['key']))
        this.setState({ tab: ANALYTICS_TAB['FD']['value'],
        test: ANALYTICS_TAB['FD']['key']});
      else if(this.state.value.includes(ANALYTICS_TAB['PC']['key']))
        this.setState({ tab: ANALYTICS_TAB['PC']['value'],
        test: ANALYTICS_TAB['PC']['key']});
      else if(this.state.value.includes(ANALYTICS_TAB['AQ']['key']))
        this.setState({ tab: ANALYTICS_TAB['AQ']['value'],
        test: ANALYTICS_TAB['AQ']['key']});
      else if(this.state.value.includes(ANALYTICS_TAB['WD']['key']))
        this.setState({ tab: ANALYTICS_TAB['WD']['value'],
        test: ANALYTICS_TAB['WD']['key']});
      this.handleDateChange(true);
    });
  };

  getMetric = () => {
    let metrics = [];
    if(this.state.value.includes(ANALYTICS_TAB['FD']['key']) && this.state.fdMetrics)
      metrics = this.state.fdMetrics.vector;
    else if(this.state.value.includes(ANALYTICS_TAB['PC']['key']) && this.state.pcMetrics)
      metrics = this.state.pcMetrics.vector;
    else if(this.state.value.includes(ANALYTICS_TAB['AQ']['key']) && this.state.aqMetrics)
      metrics = this.state.aqMetrics.vector;
    else if(this.state.value.includes(ANALYTICS_TAB['WD']['key']) && this.state.wdMetrics)
      metrics = this.state.wdMetrics.vector;
    return metrics
  }
  getNewAnalyticsData = (isMetric) => {
    if (isMetric === true) {
      const endPoint = `${API_URLS['DEVICE_METRICS']}/${this.state.value}`,
        config = getApiConfig(endPoint, 'GET');
      this.props.onDataAnalysis(config, endPoint, true);
    } else {
      let metrics = this.getMetric(),
        dataToPost = {'fn': {}};
      metrics.map((dt, index) => {
        dataToPost['fn'][dt.path] = this.state[dt.path] ? this.state[dt.path] : dt.statistic;
      })
      const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.value}`,
        params = {
          'start' : this.state.start,
          'end': this.state.end,
          'aggregateby': this.state.sampling,
          'unit': this.state.unit,
        };
      let headers, config;
      // if(this.state[`${this.state.test}SessionHeader`])
      headers = {
        'x-sc-session-token': this.state[`${this.state.test}SessionHeader`]? this.state[`${this.state.test}SessionHeader`]: ''
      };
      config = getApiConfig(endPoint, 'POST', dataToPost, params, headers);
      this.props.onDataAnalysis(config, endPoint);
    }
  }

  handleSamplingChange = (event) => {
    const {name, value, id} = event.target;
    this.setState({
        [name] : value
    }, function() {
      if(id === 'update') {
        this.getNewAnalyticsData();
      }
    });
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
      end: end,
      PCSessionHeader: '',
      AQSessionHeader: ''
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
    if (this.props.dataAQAnalysis &&
      !isEqual(this.props.dataAQAnalysis, prevProps.dataAQAnalysis)){
        this.setState({AQSessionHeader: this.props.dataAQAnalysis.headers['x-sc-session-token']});
    }
    if (this.props.dataPCAnalysis &&
      !isEqual(this.props.dataPCAnalysis, prevProps.dataPCAnalysis)){
        this.setState({PCSessionHeader: this.props.dataPCAnalysis.headers['x-sc-session-token']});
    }
  }

  getVector=(metricsResponse) => {
    let dataMetrics = {};
    metricsResponse.map((metrics) => {
      dataMetrics['metricType'] = metrics['Data']['MetricType'];
      dataMetrics['name'] = metrics['Data']['Name'];
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
            <RadioButtonComponent data={this.state} projectList={this.state.projectList}
              handleChange={this.handleChange} handleSelect={this.handleSelect}/>
            <div className={classes.seperator}></div>
          { this.state.page === ANALYTICS_SUB_TABS['ALERT']['key'] &&
            <AlertAnalysis/>
          }
          { this.state.page === ANALYTICS_SUB_TABS['DISPENSER']['key'] &&
            <DispenserAnalysis/>
          }
          { (this.state.projectList &&
            this.state.page === ANALYTICS_SUB_TABS['INSTALLATION_DETAILS']['key'] ) &&
            <DataAnalysisComponent data={this.props} stateData={this.state}
              handleDateChange={this.handleDateChange}
              handleTabChange={this.handleTabChange}
              handleSamplingChange={this.handleSamplingChange}
              getMetric={this.getMetric}/>
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