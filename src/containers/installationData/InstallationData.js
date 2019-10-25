import React, { Component } from 'react';
import {connect} from 'react-redux';
import _, {isEqual} from 'lodash';
import moment from 'moment-timezone';
import {withStyles, LinearProgress} from '@material-ui/core';

import {API_URLS, NAMESPACE_MAPPER, PROJECT_ACTIONS,
    GRAPH_RENDER_TYPE, DATE_TIME_FORMAT, RANGE_ERROR} from '../../constants/Constant';
import DataViewAnalysis from "../../components/dataAnalysis/DataViewAnalysis";
import {getApiConfig} from '../../services/ApiCofig';
import RadioButtonComponent from '../../components/dataAnalysis/RadioButtonController';
import {projectSubMenuList, projectDataMetricList,
    projectAnalysisData, InitialiseDataState,
    InitialiseMetricState} from '../../actions/DataAnalysis';
import {formatDateWithTimeZone, formatDateTime,
    getTodaysStartDateTime, getXHourOldDateTime} from '../../utils/DateFormat';
import {getVector, getStartEndTime} from '../../utils/AnalyticsDataFormat';
import CustomPopOver from '../../components/modal/PopOver';
import PageLoader from '../../components/pageLoader/PageLoader';

import styles from './InstallationDataStyle';
/***
 * Container Class for Installation Dashboard view
 */
class InstallationData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            loading: true,
            projectList: [],
            startDate: getTodaysStartDateTime(),
            endDate: new Date(),
            selectedIndex: 6,
            notFoundError: '',
            metricNotFound: false
        }
        this.metricsIndex = 0;
        this.metricLength = 0;
        this.metricsIndexReceived = 0;
    }
    getProjectData = () => {
    /**
     * Set the loading value to true to show up loading icon
     * and call the api for fetch analytics data for selected project id.
     */
        this.setState({
            loading: true,
        }, function() {
            let getEndPoint = `${API_URLS['NEW_DEVICE_DATA']}/${this.state.pid}`,
                params = {
                    action: `${PROJECT_ACTIONS['INSTALLATIONHOMEPAGE']}_${this.state.insid}`
                },
                getconfig = getApiConfig(getEndPoint, 'GET', '', params);
            this.props.onDataMetricList(getconfig);
        })
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

    handleChange = (event, pid, insid) => {
    /**
     * This function will be called from the component on selecting
     * value from 'RadioButtonController'.
     * Passing insid to API(Action) and get the list of services associated with
     * passed actionid
     */
        this.setState({
            insid: insid ? insid: this.state.insid,
            value: insid ? insid: this.state.insid,
        }, function() {
            this.props.onInitialState();
            this.metricsIndex = 0;
            this.metricsIndexReceived = 0;
            this.getProjectData()
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
            }, function () {
                this.handleDateChange(value)
            })
        }
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
        end: type === 'default' ? formatedDate.end : this.state.end,
        startDate: type === 'default' ? formatedDate.startTime ? formatedDate.startTime : this.state.startDate : this.state.startDate,
        endDate: type === 'default' ? formatedDate.endTime ? formatedDate.endTime : this.state.endDate : this.state.endDate,
        sessionHeader: '',
        selectedIndex: type === 'default' ? formatedDate.selectedIndex ? formatedDate.selectedIndex : this.state.selectedIndex : this.state.selectedIndex,
        }, function() {
        if (type === 'default')
            this.handleChange();
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
            duration = moment.duration(end.diff(start)),
            days = duration.asDays();
    
        // Calculation to make sure api will always get max 7 days diff.
        // From start to 7 days.
        if(days > 7) {
            end = _.cloneDeep(this.state.startDate);
            end.setHours(end.getHours()+(7*24));
            // newEndDate = type === 'default' ? end : this.state.endDate;
            // newModalEndDate = end;
            this.setState({
                endDate: type === 'default' ? end : this.state.endDate,
                modalEndDate: end
            })
        }
        this.setState({
            selectedIndex: type === 'default' ? -1 : this.state.selectedIndex,
        }, function () {
            this.handleDateChange('custom', type, this.state.startDate, this.state.endDate)
        })
    }

    componentWillUnmount() {
        this.props.onInitialState();
    }

    componentDidUpdate(prevProps, prevState) {
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
     * This part will gte the metric list for dashboard. on basis of the
     * data returned in this API call, rest of the nested call will be done
     * TO get the actaul data per metrics and shown to end user on Home screen.
     */
        if(this.props.projectMetricList &&
            !isEqual(this.props.projectMetricList, prevProps.projectMetricList)
            && this.metricsIndex === 0) {
            let projectMetric = this.props.projectMetricList;
            if(projectMetric.status === 'success') {
                this.metricLength = projectMetric.data ? projectMetric.data.length : 0;
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
                                    'start_date_time' : formatDateTime(this.state.startDate, DATE_TIME_FORMAT, DATE_TIME_FORMAT),
                                    'end_date_time': formatDateWithTimeZone(this.state.endDate, DATE_TIME_FORMAT, DATE_TIME_FORMAT, this.state.timeZone),
                                },
                                config = getApiConfig(endPoint, 'POST', dataToPost, params);
                            this.props.onDataAnalysis(config);
                        })
                        this.metricsIndex += 1;
                    })
                }
            } else if(projectMetric.status === 'fail') {
                this.setState({
                    loading: false,
                    notFoundError: 'Metrics Definition not found',//projectMetric['message'],
                    metricNotFound: true
                });
            }
        }

        if (this.props.dataAnalysis &&
            !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis)) {
            let projObj = {}, metricsData={}, projData = [], dashboardData = [];
            const deviceResponse = this.props.dataAnalysis ? this.props.dataAnalysis.data.data : '';
            this.metricsIndexReceived += 1;
            if(this.props.dataAnalysis && this.props.dataAnalysis.data.status === "success") {
                // this.getInstallationLocation();
                metricsData = getVector(this.props.dataAnalysis.data.data.all_metrics, 'DASHBOARD');
                projObj['PID'] = deviceResponse.pid;
                projObj['dataAnalysis'] = deviceResponse;
                projObj['metrics'] = metricsData.dataMetrics;
                projObj['allMetrics'] = deviceResponse.all_metrics;
            } else {
                projObj['PID'] = deviceResponse.pid;
                projObj['dataAnalysis'] = {};
            }
            dashboardData.push(projObj);
            this.setState({
                dashboardData: dashboardData,
                // loading: false,
                rangeError: ''
            });
            if(this.metricsIndexReceived === this.metricLength)
                this.setState({
                    loading: false,
                });
        }
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
                dataAnalysis: {},
                value: ''
            }, function() {
                this.props.history.push(this.props.projectSelected.PID);
                this.getInstallationLocation();
            });
        }
    }

    handleClose = () => {
        this.setState({
            notFoundError: '',
            metricNotFound: false
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                {this.state.projectList.length > 0 &&
                    <RadioButtonComponent data={this.state}
                        handleChange={this.handleChange}/>
                }
                {this.state.projectList.length > 0 &&
                    <div className={classes.seperator}></div>
                }
                {(this.state.dashboardData &&
                <div className={classes.main}>
                    <DataViewAnalysis stateData={this.state}
                        handleListSelection={this.handleListSelection}
                        handleDatePicker={this.handleDatePicker}
                        handleChangeStart={this.handleChangeStart}
                        handleChangeEnd={this.handleChangeEnd}
                        />
                </div>
                )}
                {this.state.loading &&
                    <PageLoader isOpaque={false}/>
                    // <LinearProgress className={classes.buttonProgress}/>
                }
                {this.state.metricNotFound &&
                    <CustomPopOver content={this.state.notFoundError} open={this.state.metricNotFound}
                        handleClose={this.handleClose} variant='error'/>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectSubMenuList : state.DataAnalysisProjectListSubMenuReducer.data,
        projectSelected : state.projectSelectReducer.data,
        projectMetricList: state.ProjectMetricListReducer.data,
        dataAnalysis : state.DataAnalysisReducer.data,
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
        onDataMetricList: (config) => {
            dispatch(projectDataMetricList(config))
        },
        onDataAnalysis: (config) => {
            dispatch(projectAnalysisData(config))
        },
        onInitialState: () => {
            dispatch(InitialiseDataState())
            dispatch(InitialiseMetricState())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(InstallationData));