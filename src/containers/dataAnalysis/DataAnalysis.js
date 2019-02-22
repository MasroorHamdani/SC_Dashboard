import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles, LinearProgress} from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment-timezone';
import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, NAMESPACE, NAMESPACE_MAPPER} from '../../constants/Constant';
import {projectSubMenuList, projectInstallationList,
  projectAnalysisData, projectMenuList, clearDataAnalysis} from '../../actions/DataAnalysis';
import styles from './DataAvalysisStyle';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';
import {getStartEndTime, getVector} from '../../utils/AnalyticsDataFormat';


/***
 * Container Class for Data Analysis view
 */
class DataAnalysis extends Component {
  constructor(props) {
    super(props);
    // For setting start time as one hour prior to current time and end time as current time
    let now = new Date();
        now.setHours(now.getHours()-1);
    this.state = {
      value: '',
      header: "Devices Locations",
      projectList: [],
      analysisAQData: '',
      start: 0,
      end: 0,
      tab: '',
      sampling: '',
      unit: '',
      func: '',
      page: '',
      loading: true,
      success: false,
      selectedIndex: 0,
      startDate: now,
      endDate: new Date(),
    };
    this.menuIndex = 0;
  }

  handleClick = (index) => {
    this.setState(state => ({
      [index]: !state[index]
    }));
  };
  handleDatePicker = () => {
  /**
   * This function will called from component 'DateRowComponent'
   * on hitting th 'GO' buttomn for submitting the start and end date time.
   * As the selected date is custom it will call the function with custom keyword passed as one
   * of teh param along with staet and end time
   */
    let start = moment(this.state.startDate);
    let end = moment(this.state.endDate);
    let duration = moment.duration(end.diff(start));
    let days = duration.asDays();

    // Calculation to make sure api will always get max 7 days diff.
    // From start to 7 days.
    if(days > 7) {
      end = _.cloneDeep(this.state.startDate);
      end.setHours(end.getHours()+(7*24));
    }
    this.setState({
        selectedIndex: -1,
        endDate: end
    }, function () {
    this.handleDateChange('custom',
        this.state.startDate, this.state.endDate)
    })
  }
  handleChangeStart  = (date) => {
  /**
   * This function will be called from the component 'DateRowComponent'
   * on selecting the date/time in startDate DatePicker,
   * which will pass the date selected as param and
   * this function will save the date time in startDate object
   */
    this.setState({
        startDate: date
    });
  }
  handleChangeEnd  = (date) => {
  /**
   * This function will be called from the component 'DateRowComponent'
   * on selecting the date/time in endDate DatePicker,
   * which will pass the date selected as param and
   * this function will save the date time in endDate object
   */
    this.setState({
        endDate: date
    });
  }
  handleListSelection = (event, value, index) => {
  /**
   * This function will be called from component 'DateRowComponent'
   * on selecting and list for time,
   * this will send the value of list item selected along with index of the item.
   * the value is sent to next function to calculate the start and end date time.
   * And the index is saved in state to highlight the selected list item.
   */
    this.setState({
        selectedIndex: index
    }, function () {
        this.handleDateChange(value)
    })
  }

  handleChange = (event, pid, insid) => {
  /**
   * This function will be called from the component on selecting
   * value from 'RadioButtonController'.
   * passing with pid and insid as input.
   * This function will make an API call to get the 
   * date for passed pid and its associated insid.
   * This API will return the list of Sensors for passed
   * insid.
   * onInstalationsList is the prop function called for it.
   * API data will be in 'DataAnalysisInstallationListReducer'
   */
    this.setState({
      installationList: {},
      value: insid,
      dataAnalysis: {},
      loading: true,
      success: false,
      tab: ''
    }, function() {
      const endPoint = `${API_URLS['PROJECT_DETAILS']}/${pid}${API_URLS['PROJECT_LOCATION']}/${insid}`,
      params = {
        'getinsinfo' : false
      },
      config = getApiConfig(endPoint, 'GET', '', params);
      this.props.onInstalationsList(config);
    });
  }

  handleTabChange = (event, tab) => {
  /**
   * This function is called from component 'DataAnalysisComponent'
   * on tab selection.
   * It will make further calls to setup state values.
   */
    Object.keys(this.state.installationList).map((key) => {
      if(key === tab) {
        this.setStateValue(tab, this.state.installationList[key].type,
          this.state.installationList[key].devid, this.state.installationList[key].subType, this.state.installationList[key].pid)
      }
    })
  };

  setStateValue(tab, deviceKey, devid, subType, pid) {
  /**
   * This function is called internally on tab selection.
   * This function will update the state value as per the tab selected
   * in Data Analytics view.
   * It will reinitiate some of the state values to default one.
   */
    let now = new Date();
        now.setHours(now.getHours()-1);
    this.setState({
      tab: tab,
      deviceKey: deviceKey,
      deviceId: devid,
      subType: subType,
      pid: pid,
      dataAnalysis: {},
      startDate: now,
      endDate : new Date(),
      selectedIndex: 0
    }, function() {
      this.handleDateChange(true);
    });
  }

  handleDateChange = (param='', startDate='', endDate='') => {
  /**
   * This function is called from multiple sources.
   * Internally as well as well from component 'AnalysisData' directly
   * for refresh functionality.
   * This function will take care of the timezone change and call other function
   * which will make an API call.
   */
    let timeZone = localStorage.getItem(this.state.pid);
    let formatedDate = getStartEndTime(param, startDate, endDate, timeZone);
    this.setState({
      start: formatedDate.start,
      end: formatedDate.end,
      sessionHeader: ''
    }, function() {
      this.getNewAnalyticsData();
    })
  }

  getMetric = () => {
    /**
     * This function will be called internally,
     * this function will check the existance of metrics for selected tab.
     * If found, that will be returned else empty data will be sent out.
     */
    let metrics = [], allMetrics = [];
    if(this.state.metrics) {
      metrics = this.state.metrics.vector;
      allMetrics = this.state.allMetrics;
    }
    return {'metric' : metrics,
            'allMetrics': allMetrics}
  }

  getNewAnalyticsData = () => {
  /**
   * This function is called internally for API call.
   * This API will set the basic data to Post,
   * next it will call an internal function to get the existing metric value for selected tab if any.
   * In case metric is present, it will do the changes in data to post,
   * else default value for the data to post will be passed to API.
   * The Data will be passed bu reducer 'DataAnalysisReducer'
   */
    this.setState({
      loading: true,
      success: false,
    })
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
        'start' : this.state.start,
        'end': this.state.end,
      };
    let headers = {
      'x-sc-session-token': this.state.sessionHeader ? this.state.sessionHeader : ''
    },
    config = getApiConfig(endPoint, 'POST', dataToPost, params, headers);
    this.props.onDataAnalysis(config, endPoint);
  }

  handleSamplingChange = (event, mainPath='', path='') => {
  /**
   * This function will be called from a component 'DataProcessingComponent'
   * This will be used by the sampling widget to update the field value.
   * By Sampling - All the Dimentions for the graph will be displayed to user
   * and user can change the value of dimentions and function to get new/relavant view of the data.
   * As sampling is per metric, so the update is nested.
   * Like, for PC there will be an entry in state as PC:{}
   * depending on which field is changed in sampling above value will update like
   * PD:{v:'',x:''}
   */
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
  /**
   * First function beiomg called on loading.
   */
    const endPoint = API_URLS['DASHBOARD'],
    config = getApiConfig(endPoint, 'GET');
    this.props.onDataAnalysisMenu(config);
  }
  componentWillUnmount() {
    this.props.onReducerClear();
  }
  componentDidUpdate(prevProps, prevState) {
  /**
   * This function is called whenever component update,
   * which included getting date from the API as well in reducers.
   * we need to check if reducer got value and if current value is different the old,
   * then only we should proceed.
   */
  /**
   * This part is for getting the list of Projects allocated to logged in user.
   * Once Projects are received, there has to be other API call for each Project
   * to get the installation details for all the projects. Which will be shown as sub menu on UI.
   * Reducer for projects - 'DataAnalysisMenuListReducer'
   * Reducer for installations - 'DataAnalysisProjectListSubMenuReducer'
   */ 
    if ((this.props.projectMenuList || this.props.projectSubMenuList) &&
      (!isEqual(this.props.projectSubMenuList, prevProps.projectSubMenuList) ||
      !isEqual(this.props.projectMenuList, prevProps.projectMenuList))
      ) {
        let project = this.state.projectList, newProjectList = [],
          projObj = {};
          this.props.projectMenuList.map((row) => {
            if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS'])
            newProjectList.push(row);
          });

        if(this.menuIndex <= newProjectList.length) {
          let data = newProjectList[this.menuIndex];
          this.menuIndex = this.menuIndex +1;
          if(data && data.PID) {
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${data.PID}${API_URLS['WASHROOM_LOCATION']}`,
            config = getApiConfig(endPoint, 'GET');
            this.props.onDataAnalysisMenu(config, 'subMenu');
          }
          let SUB1, SUB2;
          if (this.props.projectSubMenuList &&
            (!isEqual(this.props.projectSubMenuList, prevProps.projectSubMenuList)
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

    /**
     * This part is for data for selected device for selected time frame.
     * There is 'x-sc-session-token' passed in response, which is saved in state,
     * for being used in sampling, as sampling will run all the functions on the cached data
     * which can be accessed from the x-sc-session-token.
     */
    if (this.props.dataAnalysis &&
      !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis) &&
      isEqual(this.props.dataAnalysis.data.status, "success")){
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
    /**
     * This part deals with getting the sensor installation details for selected location.
     * One location can have multiple Devices of same type.
     * That is being handled by appending numbers to the type.
     */
    if (this.props.installationList &&
      !isEqual(this.props.installationList, prevProps.installationList)) {
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
    /**
     * This section deals with progress bar.
     * As the API data is served, this section will stop the progress bar loading.
     */
    if(this.state.loading) {
      this.setState({
        loading: false,
        success: true,
      })
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
            handleSamplingChange={this.handleSamplingChange}
            handleDatePicker={this.handleDatePicker}
            handleChangeStart={this.handleChangeStart}
            handleListSelection={this.handleListSelection}
            handleChangeEnd={this.handleChangeEnd}
            />
        }
        {this.state.loading &&
          <LinearProgress className={classes.buttonProgress}/>
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
      projectMenuList : state.DataAnalysisMenuListReducer.data,
      projectSubMenuList : state.DataAnalysisProjectListSubMenuReducer.data,
      installationList : state.DataAnalysisInstallationListReducer.data,
      dataAnalysis : state.DataAnalysisReducer.data
  }
}

function mapDispatchToProps(dispatch) {
  /**
   * Actions defined for API calls.
   */
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
    },
    onReducerClear: () => {
      dispatch(clearDataAnalysis())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DataAnalysis));