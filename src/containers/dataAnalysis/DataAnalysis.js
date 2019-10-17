import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {withStyles, LinearProgress} from '@material-ui/core';
import _, {sortBy} from 'lodash';
import moment from 'moment-timezone';
import DataAnalysisComponent from '../../components/dataAnalysis/DataAnalysis';
import {getApiConfig} from '../../services/ApiCofig';
import {API_URLS, NAMESPACE_MAPPER, RANGE_ERROR,
  PROJECT_ACTIONS, GRAPH_RENDER_TYPE} from '../../constants/Constant';
import {projectSubMenuList, projectInstallationList,
  projectAnalysisData, clearDataAnalysis,
  modalProjectAnalysisData, projectDataMetricList,
  InitialiseDataState, InitialiseMetricState} from '../../actions/DataAnalysis';
import styles from './DataAnalysisStyle';
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
    this.metricsIndex = 0;
    this.metricLength = 0;
    this.metricsIndexReceived = 0;
  }

  handleDatePicker = (type) => {
  /**
   * This function will called from component 'DateRowComponent'
   * on hitting th 'GO' buttomn for submitting the start and end date time.
   * As the selected date is custom it will call the function with custom keyword passed as one
   * of teh param along with staet and end time
   */
    this.metricsIndex = 0;
    this.metricsIndexReceived = 0;
    this.props.onInitialState();
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
    this.metricsIndex = 0;
    this.metricsIndexReceived = 0;
    this.props.onInitialState();
    if (type === 'default') {
      this.setState({
        selectedIndex: index,
        indexValue : index === 6 ? '15min' : value,
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
    this.metricsIndex = 0;
    this.metricsIndexReceived = 0;
    this.props.onInitialState();
    this.state.installationList.map((row) => {
      if(row.key === tab) {
        this.setStateValue(tab, row.key,
          row.devid, row.subType, row.pid)
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
      modalSelectedIndex: 6,
      indexValue: '15min'
    }, function() {
      this.handleDateChange('Today');
    });
  }

  refreshData = () => {
    this.metricsIndex = 0;
    this.metricsIndexReceived = 0;
    this.props.onInitialState();
    this.setState({
      startDate: getTodaysStartDateTime(),
      endDate : new Date(),
      indexValue: '15min'
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
        this.getCompleteMetrics();
      else if (type === 'modal')
        this.getModalAnalyticsData();
    })
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
    let dataToPost = {};

    if(this.state.projectMetricList && this.state.projectMetricList.length > 0) {
      this.state.projectMetricList.map(row => {
        Object.values(row)[0].Metrics.map(rowValue => {
          if(Object.values(rowValue)[0].metric_id === this.state.selectedMetric)
            dataToPost['all_metrics'] = Object.values(rowValue);
        })
      })
      let endPoint = `${API_URLS['NEW_DEVICE_DATA']}/${this.state.pid}`,
        params = {
          'start_date_time' : this.state.modalStart,//formatDateTime(this.state.start, DATE_TIME_FORMAT, DATE_TIME_FORMAT),
          'end_date_time': this.state.modalEnd,//formatDateWithTimeZone(this.state.end, DATE_TIME_FORMAT, DATE_TIME_FORMAT, this.state.timeZone),
        },
        headers = {
            'x-sc-session-token': this.state.sessionHeader ? this.state.sessionHeader : ''
        },
        config = getApiConfig(endPoint, 'POST', dataToPost, params, headers);
      this.props.onModalDataAnalysis(config);
    }
  }

  getCompleteMetrics = () => {
  /**
   * This Function will call the API which will get the list of
   * all the metrics part for this device
   */
    this.setState({loading: true}, function() {
      let getEndPoint = `${API_URLS['NEW_DEVICE_DATA']}/${this.state.pid}`,
        params = {
          action: `${PROJECT_ACTIONS['INSTALLATIONPAGE']}_${this.state.deviceId}` //Change to Device level Action name
        },
        getconfig = getApiConfig(getEndPoint, 'GET', '', params);
        this.props.onDataMetricList(getconfig);
      });
  }

  handleSamplingChange = (event, mainPath='', path='', action) => {
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
      this.getCompleteMetrics();
    } else {
      let data = this.state[this.state.deviceKey][mainPath][path]
      data.map((row) => {
        if(row.type === action) {
          row.criteria[name] = value
        }
      })
      this.setState({
        [this.state.deviceKey]: {...this.state[this.state.deviceKey]}
      })
    }
  }

  componentWillUnmount() {
    this.props.onInitialState();
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
      this.metricsIndex = 0;
      this.metricsIndexReceived = 0;
      this.props.onInitialState();
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
    !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis)) {
    if(isEqual(this.props.dataAnalysis.data.status, "success")) {
        let metricsData = getVector(this.props.dataAnalysis.data.data.all_metrics, this.state.deviceKey);
        this.setState({
          sessionHeader: this.props.dataAnalysis.headers['x-sc-session-token'],
          metrics: metricsData.dataMetrics,
          allMetrics: this.props.dataAnalysis.data.data.all_metrics,
          dataAnalysis: this.props.dataAnalysis
        });
        let referData = {};
        if(metricsData.metric) {
          Object.keys(metricsData.metric).map((key) => {
            let value = {}
            metricsData.metric[key].map((dt) => {
              Object.keys(dt).map((d) => {
                let val=[];
                dt[d].actions.map((action) => {
                  val.push(action);
                })
                value[d] = val;
              })
            })
            referData[key] = value;
          })
        }
        this.setState({[this.state.deviceKey]: referData,
          loading: false,
          rangeError: ''})
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
        let sorted_list = sortBy(this.props.installationList,'Display')
        sorted_list.map((tab)=> {
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
          if(installationList[tab.Type]) {
            installationList[`${tab.Type}-${i}`] = list;
            installationList[`${tab.Type}-${i}`]['key'] = `${installationList[`${tab.Type}-${i}`]['key']}-${i}`;
            i = i + 1;
          } else{
            installationList[tab.Type] = list
          }
        })
        this.setState({installationList: sortBy(installationList,'index'), loading: false,})
    }
    if (this.props.modalDataAnalysis &&
      !isEqual(this.props.modalDataAnalysis, prevProps.modalDataAnalysis)) {
        if(isEqual(this.props.modalDataAnalysis.data.status, "success")) {
          let metricsData = getVector(this.props.modalDataAnalysis.data.data.all_metrics, this.state.deviceKey);
          this.setState({
            modalSessionHeader: this.props.modalDataAnalysis.headers['x-sc-session-token'],
            modalMetrics: metricsData.dataMetrics,
            modalAllMetrics: this.props.modalDataAnalysis.data.data.all_metrics,
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
    
    if(this.props.projectMetricList &&
      !isEqual(this.props.projectMetricList, prevProps.projectMetricList)
      && this.metricsIndex === 0) {
        let projectMetric = this.props.projectMetricList;
        if(projectMetric.status === 'success') {
          this.metricLength = projectMetric ? projectMetric.data.length : 0;
          this.setState({projectMetricList: projectMetric.data});
          if(this.metricsIndex < this.metricLength) {
            projectMetric.data.map((extRow) => {
              Object.keys(extRow).map((key) => {
                let agg_query = [],
                  renderType = extRow[key]['Params']['RenderParams']['show'] ?
                    extRow[key]['Params']['RenderParams']['show'] :
                    GRAPH_RENDER_TYPE['SUBPLOT'];
                Object.keys(extRow[key]).map((k) => {
                  if(k === 'Metrics') {
                    extRow[key][k].map((metricRow) => {
                      Object.values(metricRow)[0]['renderType'] = renderType
                      Object.values(metricRow)[0]['serviceId'] = key
                      agg_query.push(Object.values(metricRow)[0])
                    })
                  }
                })
                let dataToPost = {'all_metrics' : agg_query},
                  endPoint = `${API_URLS['NEW_DEVICE_DATA']}/${this.state.pid}`,
                  params = {
                    'start_date_time' : this.state.start,//formatDateTime(this.state.start, DATE_TIME_FORMAT, DATE_TIME_FORMAT),
                    'end_date_time': this.state.end,//formatDateWithTimeZone(this.state.end, DATE_TIME_FORMAT, DATE_TIME_FORMAT, this.state.timeZone),
                  },
                  config = getApiConfig(endPoint, 'POST', dataToPost, params);
                this.props.onDataAnalysis(config);
              })
              this.metricsIndex += 1;
            })
          }
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
      modalDataAnalysis : state.ModalDataAnalysisReducer.data,
      projectMetricList: state.ProjectMetricListReducer.data
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
    },
    onDataMetricList: (config) => {
      dispatch(projectDataMetricList(config))
    },
    onInitialState: () => {
      dispatch(InitialiseDataState())
      dispatch(InitialiseMetricState())
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DataAnalysis));