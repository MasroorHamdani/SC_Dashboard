import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core';

import moment from 'moment';
import _ from 'lodash';

import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, DATE_TIME_FORMAT,
  ANALYTICS_DATE, ANALYTICS_TAB, ANALYTICS_SUB_TABS} from '../../constants/Constant';
import {projectMenuList, projectSubMenuList, projectAQAnalysisData,
  projectPCAnalysisData, projectPCMetricsData,
  projectAQMetricsData} from '../../actions/DataAnalysis';
import styles from './DataAvalysisStyle';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';

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
    sampling: 'sum',
    unit: '',
    func: '',
    page: ''
  })
  handleTabChange = (event, value) => {
    this.setState({ tab: value }, function () {
    });
  };
  handleClick = (index, pid) => {
    this.setState(state => ({ [index]: !state[index],
                            'pid': pid}));
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
        deviceKey: ANALYTICS_TAB['FD']['key']});
      else if(this.state.value.includes(ANALYTICS_TAB['PC']['key']))
        this.setState({ tab: ANALYTICS_TAB['PC']['value'],
        deviceKey: ANALYTICS_TAB['PC']['key']});
      else if(this.state.value.includes(ANALYTICS_TAB['AQ']['key']))
        this.setState({ tab: ANALYTICS_TAB['AQ']['value'],
        deviceKey: ANALYTICS_TAB['AQ']['key']});
      else if(this.state.value.includes(ANALYTICS_TAB['WD']['key']))
        this.setState({ tab: ANALYTICS_TAB['WD']['value'],
        deviceKey: ANALYTICS_TAB['WD']['key']});
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
    // if (isMetric === true) {
    //   const endPoint = `${API_URLS['DEVICE_METRICS']}/${this.state.value}`,
    //     config = getApiConfig(endPoint, 'GET');
    //   this.props.onDataAnalysis(config, endPoint, true);
    // } else {
      let metrics = this.getMetric(),
      dataToPost = {
        "metrics": [
        {
          "metricID": "pcNum",
          "metricName": "Number of People: Sampled",
          "metricType": "timeseries",
          "metricDataKey": "t",
          "dimensions": [
            {
              "type": "resampler",
              "key": "v",
              "statistic": "sum",
              "window_type": "constant",
              "window": "360T",
              "filterop": "none",
              "operand": 4,
              "name": "Number of People",
              "showSamplingWidget": true,
              "ctype": "bar",
              "id": "did1"
            }
          ]
        },
        {
          "metricID": "mid2",
          "metricName": "Total Number of People",
          "metricType": "categorical",
          "dimensions": [
            {
              "type": "resampler",
              "key": "v",
              "statistic": "sum",
              "window_type": "constant",
              "window": "Y",
              "filterop": "none",
              "operand": 3,
              "name": "People Count",
              "showSamplingWidget": false,
              "ctype": "tile",
              "id": "did2"
            }
          ]
        }
        ]
      };
    //     dataToPost = {'fn': {}};
    if(metrics) {
      console.log(metrics);
    //   metrics.map((dt, index) => {
    //     // dataToPost['fn'][dt.path] = this.state[dt.path] ? this.state[dt.path] : dt.statistic;
    //     dataToPost['metrics']['dimensions']['statistic'] = this.state[dt.path] ? this.state[dt.path] : dt.statistic;
    //     dataToPost['metrics']['dimensions']['window'] = this.state.sampling+this.state.unit;
      
    //   })
    }
      const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.pid}/${this.state.value}`,
        params = {
          'start' : '2019010100',//this.state.start,
          'end': '2019010123',//this.state.end,
          'aggregateby': this.state.sampling,
          'unit': this.state.unit,
        };
      let headers = {
        'x-sc-session-token': this.state[`${this.state.deviceKey}SessionHeader`]? this.state[`${this.state.deviceKey}SessionHeader`]: ''
      },
      config = getApiConfig(endPoint, 'POST', dataToPost, params, headers);
      this.props.onDataAnalysis(config, endPoint);
    // }
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
        let responseData = this.props.projectMenuList,//.Projects,
          project = this.state.projectList,
          projObj = {};
        if(this.state.i <= responseData.length) {
          let data = responseData[this.state.i];
          this.setState({i: this.state.i +1});
          if(data && data.PID) {
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${data.PID}${API_URLS['PROJECT_LOCATION']}`,
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

    // if (this.props.dataPCMetrics &&
    //   !isEqual(this.props.dataPCMetrics, prevProps.dataPCMetrics)){
    //     const metricsResponse = this.props.dataPCMetrics;
    //     let pcMetrics = this.getVector(metricsResponse);
    //     this.setState({pcMetrics: pcMetrics}, function() {
    //       this.getNewAnalyticsData();
    //     })
    // }
    // if (this.props.dataAQMetrics &&
    //   !isEqual(this.props.dataAQMetrics, prevProps.dataAQMetrics)){
    //     const metricsResponse = this.props.dataAQMetrics;
    //     let aqMetrics = this.getVector(metricsResponse);
    //     this.setState({aqMetrics: aqMetrics}, function() {
    //       this.getNewAnalyticsData();
    //     })
    // }
    if (this.props.dataAQAnalysis &&
      !isEqual(this.props.dataAQAnalysis, prevProps.dataAQAnalysis)){
        this.setState({AQSessionHeader: this.props.dataAQAnalysis.headers['x-sc-session-token']});
        this.setState({aqMetrics: this.props.dataAQAnalysis.data.data.allMetrics});
    }
    if (this.props.dataPCAnalysis &&
      !isEqual(this.props.dataPCAnalysis, prevProps.dataPCAnalysis)){
        this.setState({PCSessionHeader: this.props.dataPCAnalysis.headers['x-sc-session-token'],
          pcMetrics: this.getVector(this.props.dataPCAnalysis.data.data.allMetrics)});
        // console.log(this.getVector(this.props.dataPCAnalysis.data.data.allMetrics));
    }
  }

  getVector=(metricsResponse) => {
    let dataMetrics = {};
    metricsResponse.map((metrics) => {
      dataMetrics['metricType'] = metrics['MetricType'];
      dataMetrics['name'] = metrics['metricName'];
      dataMetrics['vector'] = [];
      metrics.dimensions.map((vector) => {
        dataMetrics['vector'].push({
          name: vector.name,
          path: vector.key,
          unit: vector.Unit,
          shortName: vector.id,
          // color: vector.Color,
          statistic: vector.statistic,
          chartType: vector.ctype,
          showSamplingWidget: vector.showSamplingWidget,
          window: vector.window
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
              handleChange={this.handleChange} handleSelect={this.handleSelect}
              handleClick={this.handleClick}/>
            <div className={classes.seperator}></div>
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
        // if(isMetrics) {
        //   dispatch(projectAQMetricsData(config))
        // } else {
          dispatch(projectAQAnalysisData(config))
        // }
      } else if (endPoint.includes(ANALYTICS_TAB['PC']['key'])) {
        // if(isMetrics) {
        //   dispatch(projectPCMetricsData(config))
        // } else {
          dispatch(projectPCAnalysisData(config))
        // }
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