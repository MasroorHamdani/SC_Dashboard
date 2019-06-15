import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles, LinearProgress} from '@material-ui/core';
import _, {groupBy, sortBy} from 'lodash';
import moment from 'moment-timezone';
import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, NAMESPACE_MAPPER, RANGE_ERROR} from '../../constants/Constant';
import {projectSubMenuList, projectInstallationList,
  projectAnalysisData, clearDataAnalysis, modalProjectAnalysisData} from '../../actions/DataAnalysis';
import styles from './DataAvalysisStyle';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';
import {getStartEndTime, getVector} from '../../utils/AnalyticsDataFormat';
import {getXHourOldDateTime, getTodaysStartDateTime} from '../../utils/DateFormat';


/***
 * Container Class for Data Analysis view
 */
class DataAnalysis extends Component {
  constructor(props) {
    super(props);
    // For setting start time as one hour prior to current time and end time as current time
    this.state = {
      value: '',
      projectList: [],
      start: 0,
      end: 0,
      modalStart: 0,
      modalEnd: 0,
      tab: '',
      sampling: '',
      unit: '',
      func: '',
      page: '',
      loading: true,
      selectedIndex: 6,
      startDate: getTodaysStartDateTime(),
      endDate: new Date(),
      modalStartDate: getTodaysStartDateTime(),
      modalEndDate: new Date(),
    };
    this.menuIndex = 0;
  }

  handleDatePicker = (type) => {
  /**
   * This function will called from component 'DateRowComponent'
   * on hitting th 'GO' buttomn for submitting the start and end date time.
   * As the selected date is custom it will call the function with custom keyword passed as one
   * of teh param along with staet and end time
   */
    let start = moment(this.state.startDate),
    end = moment(this.state.endDate),
    newEndDate, newModalEndDate;
    if(type === 'modal') {
      start = moment(this.state.modalStartDate);
      end = moment(this.state.modalEndDate);
    }
    
    let duration = moment.duration(end.diff(start));
    let days = duration.asDays();

    // Calculation to make sure api will always get max 7 days diff.
    // From start to 7 days.
    if(days > 7) {
      end = _.cloneDeep(type === 'modal' ? this.state.modalStartDate : this.state.startDate);
      end.setHours(end.getHours()+(7*24));
      newEndDate = type === 'default' ? end : this.state.endDate;
      newModalEndDate = end
      this.setState({
        endDate: type === 'default' ? end : this.state.endDate,
        modalEndDate: end
      })
    }
    this.setState({
        selectedIndex: type === 'default' ? -1 : this.state.selectedIndex,
        modalSelectedIndex: -1
    }, function () {
    this.handleDateChange('custom', type, 
      type === 'modal' ?  this.state.modalStartDate : this.state.startDate,
      type === 'modal' ?  this.state.modalEndDate : this.state.endDate)
    })
  }

  handleChangeStart = (date) => {
  /**
   * This function will be called from the component 'DateRowComponent'
   * on selecting the date/time in startDate DatePicker,
   * which will pass the date selected as param and
   * this function will save the date time in startDate object
   */
    this.setState({
        startDate: date,
        modalStartDate: date
    });
  }

  modalHandleChangeStart = (date) => {
  /**
   * This function will be called from the component 'DateRowComponent'
   * on selecting the date/time in startDate DatePicker,
   * which will pass the date selected as param and
   * this function will save the date time in startDate object
   */
    this.setState({
        modalStartDate: date
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
        endDate: date,
        modalEndDate: date
    });
  }
  modalHandleChangeEnd  = (date) => {
  /**
   * This function will be called from the component 'DateRowComponent'
   * on selecting the date/time in endDate DatePicker,
   * which will pass the date selected as param and
   * this function will save the date time in endDate object
   */
    this.setState({
        modalEndDate: date
    });
  }

  handleListSelection = (event, value, index, type) => {
  /**
   * This function will be called from component 'DateRowComponent'
   * on selecting and list for time,
   * this will send the value of list item selected along with index of the item.
   * the value is sent to next function to calculate the start and end date time.
   * And the index is saved in state to highlight the selected list item.
   */
    if (type === 'default') {
      this.setState({
        selectedIndex: index,
        modalSelectedIndex: index
      }, function () {
          this.handleDateChange(value)
      })
    } else if (type === 'modal') {
      this.setState({
        modalSelectedIndex: index
      }, function () {
          this.handleDateChange(value, type)
      })
    }
    
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
      tab: ''
    }, function() {
      const endPoint = `${API_URLS['PROJECT_DETAILS']}/${pid}${API_URLS['PROJECT_LOCATION']}/${insid}`,
      params = {
        'getinsinfo' : false, // This is default set to false
        'ignoreVirtualDevices' : true // This is default set to false
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
    // Object.keys(this.state.installationList).map((key) => {
    this.state.installationList.map((row) => {
      if(row.key === tab) {
        this.setStateValue(tab, row.type,
          row.devid, row.subType, row.pid) //this.state.installationList[key]
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
    this.setState({
      tab: tab,
      deviceKey: deviceKey,
      deviceId: devid,
      subType: subType,
      pid: pid,
      dataAnalysis: {},
      modalDataAnalysis: {},
      startDate: getTodaysStartDateTime(),
      endDate : new Date(),
      modalStartDate: getTodaysStartDateTime(),
      modalEndDate : new Date(),
      selectedIndex: 6,
      modalSelectedIndex: 6
    }, function() {
      this.handleDateChange('Today');
    });
  }

  refreshData = () => {
    this.setState({
      startDate: getTodaysStartDateTime(),
      endDate : new Date()
    }, function() {
      this.handleDateChange('Today');
    })
  }

  handleDateChange = (param='', type='default', startDate='', endDate='') => {
  /**
   * This function is called from multiple sources.
   * Internally as well as well from component 'AnalysisData' directly
   * for refresh functionality.
   * This function will take care of the timezone change and call other function
   * which will make an API call.
   */
    let formatedDate = getStartEndTime(param, startDate, endDate, this.state.timeZone);
    this.setState({
      start: type === 'default' ? formatedDate.start : this.state.start,
      modalStart: formatedDate.start,
      end: type === 'default' ? formatedDate.end : this.state.end,
      modalEnd: formatedDate.end,
      startDate: type === 'default' ? formatedDate.startTime ? formatedDate.startTime : this.state.startDate : this.state.startDate,
      modalStartDate: formatedDate.startTime ? formatedDate.startTime : this.state.modalStartDate ,
      endDate: type === 'default' ? formatedDate.endTime ? formatedDate.endTime : this.state.endDate : this.state.endDate,
      modalEndDate: formatedDate.endTime ? formatedDate.endTime : this.state.modalEndDate,
      sessionHeader: '',
      selectedIndex: type === 'default' ? formatedDate.selectedIndex ? formatedDate.selectedIndex : this.state.selectedIndex : this.state.selectedIndex,
      modalSelectedIndex: formatedDate.selectedIndex ? formatedDate.selectedIndex : this.state.modalSelectedIndex
    }, function() {
      if (type === 'default')
        this.getNewAnalyticsData();
      else if (type === 'modal')
        this.getModalAnalyticsData();
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
  getModalAnalyticsDataWithMetricId = (metricId) => {
    this.setState({selectedMetric: metricId},
      function() {
        this.getModalAnalyticsData();
      })
  }

  getModalAnalyticsData = () => {
    this.setState({
      loading: true,
    })
    
    let metrics = this.getMetric(),
      dataToPost = {
        "ReqType": "default",
        "Type": this.state.deviceKey,
        "SubType": this.state.subType,
        "metrics": []
      };
    if(metrics && metrics.metric.length > 0 &&
      metrics.allMetrics.length > 0 &&
      metrics.metric[0].type === this.state.deviceKey) {
        let metricIndex = metrics.allMetrics.findIndex(p => p.metricID == this.state.selectedMetric);
        dataToPost = {
          "metrics": []
        };
        dataToPost.metrics.push(metrics.allMetrics[metricIndex]);
    }
    const endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.pid}/${this.state.deviceId}`,
      params = {
        'start' : this.state.modalStart,
        'end': this.state.modalEnd,
      };
    let headers = {
      'x-sc-session-token': this.state.sessionHeader ? this.state.sessionHeader : ''
    },
    config = getApiConfig(endPoint, 'POST', dataToPost, params, headers);
    this.props.onModalDataAnalysis(config, endPoint);
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

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    if(error.toString().includes('RangeError: Invalid interval')) {
        this.setState({
            rangeError: RANGE_ERROR,
            startDate: getXHourOldDateTime(12)
          })
    } else {
        console.log(error.toString())
    }
    // You can also log error messages to an error reporting service here
  }

  componentDidMount() {
  /**
   * First function being called on loading.
   * It will check if state.pid is present or not, if not, it will check what is the value
   * selected in reducer for pid and call the required api using that value.
   */
    if(this.state.pid && this.state.timeZone) {
      this.getInstallationLocation();
    } else if(this.props.projectSelected || localStorage.getItem('projectSelected')) {
      let dt = JSON.parse(localStorage.getItem('projectSelected'));
      this.setState({
        pid: this.props.projectSelected ? this.props.projectSelected.PID : dt.PID,
        timeZone: this.props.projectSelected  ? this.props.projectSelected.Region : dt.Region
      }, function() {
        this.getInstallationLocation();
      });
    }
  }

  getInstallationLocation = () => {
    const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['WASHROOM_LOCATION']}`,
      config = getApiConfig(endPoint, 'GET');
      this.props.onDataAnalysisMenu(config);
  }

  componentDidUpdate(prevProps, prevState) {
  /**
   * This function is called whenever component update,
   * which included getting date from the API as well in reducers.
   * we need to check if reducer got value and if current value is different the old,
   * then only we should proceed.
   */
  /**
   * This part will listen to project selection change from the header component.
   * On any change this will be called and the data will be changed in UI
   * Reducer used - 'projectSelectReducer'
   */
  if(this.props.projectSelected &&
    !isEqual(this.props.projectSelected, prevProps.projectSelected)) {
      this.setState({
        pid: this.props.projectSelected.PID,
        timeZone: this.props.projectSelected.Region,
        tab: '',
        installationList: {},
        dataAnalysis: {},
        value: ''
      }, function() {
        this.props.history.push(this.props.projectSelected.PID);
        this.getInstallationLocation();
      });
  }

  /**
   * This part will get the list of locations per project,
   * as the project will be selected in the header.
   * This list will be shown as menu on UI.
   * Reducer for installations - 'DataAnalysisProjectListSubMenuReducer'
   */ 
    if (this.props.projectSubMenuList &&
        (!isEqual(this.props.projectSubMenuList, prevProps.projectSubMenuList) ||
        this.state.projectList.length === 0)) {
        let project = [],
          projObj = {}, SUB1, SUB2;;
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
        if(project[0] && project[0]['devices']) {
          this.setState({
            projectList: project,
            loading: false,
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
      !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis)){
        if(isEqual(this.props.dataAnalysis.data.status, "success")) {
          let metricsData = getVector(this.props.dataAnalysis.data.data.allMetrics, this.state.deviceKey);
          this.setState({
            sessionHeader: this.props.dataAnalysis.headers['x-sc-session-token'],
            metrics: metricsData.dataMetrics,
            allMetrics: this.props.dataAnalysis.data.data.allMetrics,
            dataAnalysis: this.props.dataAnalysis});
          let referData = {};
          if(metricsData.metric) {
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
          }
          this.setState({[this.state.deviceKey]: referData,
            loading: false,
            rangeError: '',
          })
        } else if(isEqual(this.props.dataAnalysis.data.status, 'nodata')) {
          this.setState({loading: false, dataAnalysis: 'No Data Found'})
          
        } else if(isEqual(this.props.dataAnalysis.data.status, 'failed')) {
          this.setState({loading: false, dataAnalysis: this.props.dataAnalysis.data.data.message})
        }
        else {
          this.setState({loading: false})
        }
    }

  /**
   * This part deals with getting the sensor installation details for selected location.
   * One location can have multiple Devices of same type.
   * That is being handled by appending numbers to the type.
   */
    if (this.props.installationList &&
      (!isEqual(this.props.installationList, prevProps.installationList) ||
      (!this.state.installationList || Object.keys(this.state.installationList).length === 0))) {
        let installationList = {}, i = 1;
        // let formattedData = groupBy(this.props.installationList, 'Type');
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
          if(list.key === 'FD') {
            list['index'] = 0;
          } else if(list.key === 'PPLCTR' || list.key === 'PC') {
            list['index'] = 1;
          } else if(list.key === 'ODRDTR' || list.key === 'AQ') {
            list['index'] = 2;
          } else if(list.key === 'WD') {
            list['index'] = 3;
          } else {
            list['index'] = 4;
          }
          // This section was clubing the Dispenser type devices into one and show one entry on UI rather then multiple
          // if((tab.Type === 'PT' || tab.Type === 'SS' || tab.Type === 'TR') && !installationList[tab.Type]) {
          // // This part is for stacking only the Dispenser data
          //   installationList[tab.Type] = {};
          //   installationList[tab.Type]['key'] = tab.Type;
          //   installationList[tab.Type]['text'] = formattedData[tab.Type][0]['Display'];
          //   installationList[tab.Type]['subType'] = formattedData[tab.Type][0]['SubType'];
          //   installationList[tab.Type]['pid'] = formattedData[tab.Type][0]['PID'];
          //   installationList[tab.Type]['devid'] = formattedData[tab.Type][0]['Devid'];
          //   installationList[tab.Type]['type'] = formattedData[tab.Type][0]['Type'];
          //   installationList[tab.Type]['data'] = formattedData[tab.Type];
          // }
          // else if((tab.Type === 'PT' || tab.Type === 'SS' || tab.Type === 'TR') && installationList[tab.Type]) {
          //   return;
          // }
          // else if(installationList[tab.Type]
            // (tab.Type !== 'PT' || tab.Type!== 'SS' || tab.Type !== 'TR')) {
          if(installationList[tab.Type]) {
            installationList[`${tab.Type}-${i}`] = list;
            installationList[`${tab.Type}-${i}`]['key'] = `${installationList[`${tab.Type}-${i}`]['key']}-${i}`;
            i = i + 1;
          } else{
          //if(tab.Type !== 'PT' && tab.Type !== 'SS' && tab.Type !== 'TR') {
            installationList[tab.Type] = list
          }
        })
        this.setState({installationList: sortBy(installationList,'index'), loading: false,})//sortBy(installationList,'index')
    }
    if (this.props.modalDataAnalysis &&
      !isEqual(this.props.modalDataAnalysis, prevProps.modalDataAnalysis)) {
        if(isEqual(this.props.modalDataAnalysis.data.status, "success")) {
          let metricsData = getVector(this.props.modalDataAnalysis.data.data.allMetrics, this.state.deviceKey);
          this.setState({
            modalSessionHeader: this.props.modalDataAnalysis.headers['x-sc-session-token'],
            modalMetrics: metricsData.dataMetrics,
            modalAllMetrics: this.props.modalDataAnalysis.data.data.allMetrics,
            modalDataAnalysis: this.props.modalDataAnalysis,
            loading: false});
        } else if(isEqual(this.props.modalDataAnalysis.data.status, 'nodata')) {
          this.setState({loading: false, modalDataAnalysis: 'No Data Found'})
          
        } else if(isEqual(this.props.modalDataAnalysis.data.status, 'failed')) {
          this.setState({loading: false, modalDataAnalysis: this.props.modalDataAnalysis.data.data.message})
        }
        else {
          this.setState({loading: false})
        }
      }
  }

  render () {
    const {classes} = this.props;
      return(
        <div className={classes.root}>
        {this.state.projectList.length > 0 &&
          <RadioButtonComponent data={this.state}
          handleChange={this.handleChange}/>
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
            refreshData={this.refreshData}
            getModalAnalyticsDataWithMetricId={this.getModalAnalyticsDataWithMetricId}
            modalHandleChangeStart={this.modalHandleChangeStart}
            modalHandleChangeEnd={this.modalHandleChangeEnd}
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
      projectSubMenuList : state.DataAnalysisProjectListSubMenuReducer.data,
      installationList : state.DataAnalysisInstallationListReducer.data,
      dataAnalysis : state.DataAnalysisReducer.data,
      projectSelected : state.projectSelectReducer.data,
      modalDataAnalysis : state.ModalDataAnalysisReducer.data
  }
}

function mapDispatchToProps(dispatch) {
  /**
   * Actions defined for API calls.
   */
  return {
    onDataAnalysisMenu: (config) => {
      dispatch(projectSubMenuList(config))
    },
    onModalDataAnalysis: (config) => {
      dispatch(modalProjectAnalysisData(config))
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