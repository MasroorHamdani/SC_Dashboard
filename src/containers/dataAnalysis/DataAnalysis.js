import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core';
import _ from 'lodash';

import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, ANALYTICS_TAB} from '../../constants/Constant';
import {projectMenuList, projectSubMenuList,
  projectAnalysisData} from '../../actions/DataAnalysis';
import styles from './DataAvalysisStyle';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';
import {getStartEndTime, getVector} from '../../utils/AnalyticsDataFormat';

class DataAnalysis extends Component {
  state = ({
    value: '',
    header: "Devices",
    projectList: [],
    analysisAQData: '',
    start: 0,
    end: 0,
    tab: '',
    i: 0,
    sampling: '',
    unit: '',
    func: '',
    page: '',
  })
  handleTabChange = (event, value) => {
    this.setState({ tab: value }, function () {
    });
  };

  handleClick = (index) => {
    this.setState(state => ({
      [index]: !state[index]
    }));
  };

  handleChange = (event, subType, pid) => {
    let targetValue = event.target.value;
    if(targetValue.includes(ANALYTICS_TAB['CLOGS']['key'])) {
      this.setStateValue(ANALYTICS_TAB['CLOGS']['value'], ANALYTICS_TAB['CLOGS']['key'],
        targetValue, subType, pid)
    }
    else if(targetValue.includes(ANALYTICS_TAB['FD']['key'])) {
      this.setStateValue(ANALYTICS_TAB['FD']['value'], ANALYTICS_TAB['FD']['key'],
        targetValue, subType, pid)
    }
    else if(targetValue.includes(ANALYTICS_TAB['PC']['key'])) {
      this.setStateValue(ANALYTICS_TAB['PC']['value'], ANALYTICS_TAB['PC']['key'],
        targetValue, subType, pid)
    }
    else if(targetValue.includes(ANALYTICS_TAB['AQ']['key'])) {
      this.setStateValue(ANALYTICS_TAB['AQ']['value'], ANALYTICS_TAB['AQ']['key'],
        targetValue, subType, pid)
    }
    else if(targetValue.includes(ANALYTICS_TAB['WD']['key'])) {
      this.setStateValue(ANALYTICS_TAB['WD']['value'], ANALYTICS_TAB['WD']['key'],
        targetValue, subType, pid)
    }
  };

  setStateValue(tab, deviceKey, value, subType, pid) {
    this.setState({
      tab: tab,
      deviceKey: deviceKey,
      value: value,
      subType: subType,
      pid: pid
    }, function() {
      this.handleDateChange(true);
    });
  }

  handleDateChange = (param='', startDate='', endDate='') => {
    let formatedDate = getStartEndTime(param, startDate, endDate);
    this.setState({
      start: formatedDate.start,
      end: formatedDate.end,
      sessionHeader: ''
    }, function() {
      this.getNewAnalyticsData();
    })
  }

  getMetric = () => {
    let metrics = [], allMetrics = [];
    if(this.state.metrics) {
      metrics = this.state.metrics.vector;
      allMetrics = this.state.allMetrics;
    }
    return {'metric' : metrics,
            'allMetrics': allMetrics}
  }

  getNewAnalyticsData = () => {
    let metrics = this.getMetric(),
    dataToPost = {
      "ReqType": "default",
      "Type": this.state.deviceKey,
      "SubType": this.state.subType
    };
    if(metrics && metrics.metric.length > 0 &&
        metrics.allMetrics.length > 0 &&
        metrics.metric[0].type === this.state.deviceKey) {
      dataToPost = {};
      dataToPost["metrics"] = metrics.allMetrics;
      dataToPost.metrics.map((rows) => {
        rows.dimensions.map((row) => {
          if(row.showSamplingWidget) {
            let rowData = this.state[this.state.deviceKey][rows.metricID][row.id];
            row.statistic = rowData['func'] ? rowData['func'] : row.statistic;
            row.window = rowData['sampling'] && rowData['unit'] ?
              rowData['sampling'] + rowData['unit'] : row.window;
          }
        })
      })
    }
    const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.pid}/${this.state.value}`,
      params = {
        'start' : '2019020100',//this.state.start,//'2019010100',//
        'end': '2019020423',//this.state.end,//'2019010123',//
      };
    let headers = {
      'x-sc-session-token': this.state.sessionHeader ? this.state.sessionHeader : ''
    },
    config = getApiConfig(endPoint, 'POST', dataToPost, params, headers);
    this.props.onDataAnalysis(config, endPoint);
  }

  handleSamplingChange = (event, mainPath='', path='') => {
    const {name, value} = event.target;
    if(mainPath === 'update') {
      this.getNewAnalyticsData();
    } else {
      this.setState({
        [this.state.deviceKey]: {...this.state[this.state.deviceKey],
          [mainPath]: {...this.state[this.state.deviceKey][mainPath],
            [path]: {...this.state[this.state.deviceKey][mainPath][path],
              [name]: value
            }
          }
        }
      });
    }
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
        let responseData = this.props.projectMenuList,
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
                projObj['id'] = deviceResponse[0].PID;
                projObj['name'] = deviceResponse[0].PID;
                projObj['devices'] = deviceResponse;
                project.push(projObj);
          }
        }
        if(project[0] && project[0]['devices']) {
          this.setState({
            projectList: project
          })
        }
    }

    if (this.props.dataAnalysis &&
      !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis)){
        let metricsData = getVector(this.props.dataAnalysis.data.data.allMetrics, this.state.deviceKey);
        this.setState({
          sessionHeader: this.props.dataAnalysis.headers['x-sc-session-token'],
          metrics: metricsData.dataMetrics,
          allMetrics: this.props.dataAnalysis.data.data.allMetrics});
        let referData = {};
        Object.keys(metricsData.metric).map((key) => {
          let value = {}
          metricsData.metric[key].map((dt) => {
            Object.keys(dt).map((d) => {
              value[d] = {};
            })
          })
          referData[key] = value;
        })
        if(!this.state[this.state.deviceKey])
            this.setState({[this.state.deviceKey]: referData})
    }
  }

  render () {
    const {classes} = this.props;
      return(
        <div className={classes.root}>
            <RadioButtonComponent data={this.state} projectList={this.state.projectList}
              handleChange={this.handleChange}
              handleClick={this.handleClick}/>
            <div className={classes.seperator}></div>
          { 
              this.state.projectList &&
            <DataAnalysisComponent data={this.props} stateData={this.state}
              handleDateChange={this.handleDateChange}
              handleTabChange={this.handleTabChange}
              handleSamplingChange={this.handleSamplingChange}/>
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
      dataAnalysis : state.DataAnalysisReducer.data
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