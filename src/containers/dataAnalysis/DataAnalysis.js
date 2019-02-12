import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core';
import _ from 'lodash';

import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, NAMESPACE,
  NAMESPACE_MAPPER} from '../../constants/Constant';
import {projectSubMenuList, projectInstallationList,
  projectAnalysisData, projectMenuList} from '../../actions/DataAnalysis';
// import {dashboardData} from '../../actions/DashboardAction';
import styles from './DataAvalysisStyle';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';
import {getStartEndTime, getVector} from '../../utils/AnalyticsDataFormat';

class DataAnalysis extends Component {
  state = ({
    value: '',
    header: "Devices Locations",
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

  handleClick = (index) => {
    this.setState(state => ({
      [index]: !state[index]
    }));
  };

  handleChange = (event, pid, insid) => {
    this.setState({installationList: {},
    value: insid,
    dataAnalysis: {}})
    const endPoint = `${API_URLS['PROJECT_DETAILS']}/${pid}${API_URLS['PROJECT_LOCATION']}/${insid}`,
    params = {
      'getinsinfo' : false
    },
    config = getApiConfig(endPoint, 'GET', '', params);
    this.props.onInstalationsList(config);
  }
  handleTabChange = (event, tab) => {
    Object.keys(this.state.installationList).map((key) => {
      if(key === tab) {
        this.setStateValue(tab, this.state.installationList[key].type,
          this.state.installationList[key].devid, this.state.installationList[key].subType, this.state.installationList[key].pid)
      }
    })
  };

  setStateValue(tab, deviceKey, devid, subType, pid) {
    this.setState({
      tab: tab,
      deviceKey: deviceKey,
      deviceId: devid,
      subType: subType,
      pid: pid,
      dataAnalysis: {}
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
    const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.pid}/${this.state.deviceId}`,
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
      !isEqual(this.props.projectMenuList, prevProps.projectMenuList))
      // && (this.state.projectList.length > 0)
      ) {
        // console.log('*************');
        let project = this.state.projectList, newProjectList = [],
          projObj = {};
          this.props.projectMenuList.map((row) => {
            if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS'])
            newProjectList.push(row);
          });

        if(this.state.i <= newProjectList.length) {
          let data = newProjectList[this.state.i];
          this.setState({i: this.state.i +1});
          if(data && data.PID) {
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${data.PID}${API_URLS['WASHROOM_LOCATION']}`,
            config = getApiConfig(endPoint, 'GET');
            this.props.onDataAnalysisMenu(config, 'subMenu');
          }
          let SUB1, SUB2;
          if (this.props.projectSubMenuList &&
            (!isEqual(this.props.projectSubMenuList, prevProps.projectSubMenuList)
            // || !this.state.projectList.devices.length > 0
            )) {
                const deviceResponse = this.props.projectSubMenuList;
                projObj['id'] = deviceResponse[0].PID;
                projObj['name'] = deviceResponse[0].PID;
                deviceResponse.map((row) => {
                  SUB1 = NAMESPACE_MAPPER[row['NS']].SUB1;
                  SUB2 = NAMESPACE_MAPPER[row['NS']].SUB2;
                  row[SUB1] =  row.SUB1;
                  row[SUB2] = row.SUB2;
                })
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
          allMetrics: this.props.dataAnalysis.data.data.allMetrics,
          dataAnalysis: this.props.dataAnalysis});
        let referData = {};
        Object.keys(metricsData.metric).map((key) => {
          let value = {}
          metricsData.metric[key].map((dt) => {
            Object.keys(dt).map((d) => {
              let val = {
                'func' : dt[d].statistic,
                'sampling': dt[d].sampling,
                'unit': dt[d].unit
              }
              value[d] = val;
            })
          })
          referData[key] = value;
        })
        if(!this.state[this.state.deviceKey])
            this.setState({[this.state.deviceKey]: referData})
    }
    if (this.props.installationList &&
      !isEqual(this.props.installationList, prevProps.installationList)){
        let installationList = {}, i = 1;
        this.props.installationList.map((tab) => {
          let list = {
            'key': tab.Type,
            'text': tab.Display,
            'conn': tab.Conn,
            'subType': tab.SubType,
            'type': tab.Type,
            'devid': tab.Devid,
            'pid': tab.PID
          }
          if(installationList[tab.Type]) {
            installationList[`${tab.Type}-${i}`] = list;
            installationList[`${tab.Type}-${i}`]['key'] = `${installationList[`${tab.Type}-${i}`]['key']}-${i}`;
            i = i + 1;
          } else {
            installationList[tab.Type] = list
          }
        })
        this.setState({installationList: installationList})
    }
}

  render () {
    const {classes} = this.props;
      return(
        <div className={classes.root}>
        {this.state.projectList.length > 0 &&
          <RadioButtonComponent data={this.state}
          handleChange={this.handleChange}
          handleClick={this.handleClick}/>
        }
        {this.state.projectList.length > 0 &&
          <div className={classes.seperator}></div>
        }
        {this.state.installationList &&
          <DataAnalysisComponent stateData={this.state}
            handleDateChange={this.handleDateChange}
            handleTabChange={this.handleTabChange}
            handleSamplingChange={this.handleSamplingChange}/>
        }
          {/* { !this.state.projectList &&
            <div>No Projects Assigned</div>
          } */}
          </div>

      )
  }
}

function mapStateToProps(state) {
  return {
      projectMenuList : state.DataAnalysisMenuListReducer.data,//state.DashboardReducer.data,
      projectSubMenuList : state.DataAnalysisProjectListSubMenuReducer.data,
      installationList : state.DataAnalysisInstallationListReducer.data,
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
    onInstalationsList: (config) => {
      dispatch(projectInstallationList(config))
    },
    onDataAnalysis: (config) => {
        dispatch(projectAnalysisData(config))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DataAnalysis));