import React, { Component } from "react";
import {connect} from 'react-redux';
import _, {isEqual, groupBy, orderBy} from 'lodash';

import AlertAnalysis from "../components/dataAnalysis/AlertAnalysis";
import {API_URLS, DATE_TIME_FORMAT, NAMESPACE_MAPPER,
    RANGE_ERROR, ALERT_STATUS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {projectSubMenuList, initialiseProjectLocationState,
    initialiseAlertListState, projectAlertList} from '../actions/DataAnalysis';
import {formatDateTime, getTodaysStartDateTime} from '../utils/DateFormat';

class AlertDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            startDate: getTodaysStartDateTime(),
            endDate: new Date(),
            dateChanged: false,
            loading: true,
            insid: '',
            alertCount : {
                'not_resolved': 0,
                'pending': 0,
                'resolved': 0,
                'work_started': 0,
                'acknowledged': 0
            }
        }
        this.info = false;
    }

    handleChangeStart  = (date) => {
    /**
     * Handle datetime change for state date, from date picker
     */
        this.setState({
            startDate: date,
            dateChanged: true
          });
    }

    handleChangeEnd  = (date) => {
    /**
     * Handle datetime change for end date, from date picker
     */
        this.setState({
            endDate: date,
            dateChanged: true
          });
    }

    setStateValue = (event) => {
    /**
     * Generic function to set the state variable
     */
        let {name, value} = event.target;
        this.setState({[name]: value})
    }

    getInstallationLocation = () => {
    /**
     * Make an API call and get installation location details for selected project.
     */
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['WASHROOM_LOCATION']}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onDataAnalysisMenu(config);
    }

    componentWillUnmount() {
        this.props.onInitialState();
    }
    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        if(error.toString().includes('RangeError: Invalid interval')) {
            this.setState({
                rangeError: RANGE_ERROR,
                startDate: getTodaysStartDateTime()
              })
        } else {
            console.log(error.toString())
        }
        // You can also log error messages to an error reporting service here
    }

    componentDidMount() {
    /**
     * Check id pid and timezone are present in state,
     * if yes get the data by calling internal functions,
     * or set the value first and then make the call.
     */
        if(this.state.pid && this.state.timeZone){
            this.getInstallationLocation();
            this.getAlertData();
        } else if(this.props.projectSelected || localStorage.getItem('projectSelected')) {
            let dt = JSON.parse(localStorage.getItem('projectSelected'));
            this.setState({
                timeZone: this.props.projectSelected? this.props.projectSelected.Region: dt.Region
            }, function() {
                this.getInstallationLocation();
                this.getAlertData();
            });
        }
    }

    getAlertData = () => {
    /**
     * This function will check if installtion id was selected,
     * if id is selected then call the api got for particuler id and get the alerts,
     * else make a generic api call on project basis to get all the alerts.
     * Timezone is considered, as devices are located at different locations,
     * and DB has location specific data for installations,
     * in order to show data to user being present in any part of the world,
     * the datetime is generated as per the project timezone 
     */
        this.setState({
            loading: true,
        },function() {
            let endPoint;
            if(!this.state.insid) {
                endPoint = `${API_URLS['PROJECT_ALERT']}/${this.state.pid}`;
            }
            else {
                endPoint = `${API_URLS['PROJECT_ALERT']}/${this.state.pid}${API_URLS['INSTALLATION']}/${this.state.insid}`;
                this.showFilter = true;
            }
            let params = {
                'start' : formatDateTime(this.state.startDate),
                'end' : formatDateTime(this.state.endDate)
            },
            config = getApiConfig(endPoint, 'GET', '', params);
            this.props.onProjectAlert(config);
        })
    }

    componentDidUpdate(prevProps, prevState) {
    /**
     * This part will listen to project selection change from the header component.
     * On any change this will be called and the data will be changed in UI
     * Reducer used - 'projectSelectReducer'
     */
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)){
            if(this.state.pid !== this.props.projectSelected.PID || !this.state.timeZone){
                this.setState({
                    pid: this.props.projectSelected.PID,
                    timeZone: this.props.projectSelected.Region,
                    insid: '',
                    alertCount : {
                        'not_resolved': 0,
                        'pending': 0,
                        'resolved': 0,
                        'work_started': 0,
                        'acknowledged': 0
                    }
                }, function() {
                        this.props.history.push(this.props.projectSelected.PID);
                        // this.props.onInitialState()
                        this.getInstallationLocation()
                        this.getAlertData();
                })
            }
        }

    /**
     * This part will deal with alert data for project.
     * The data from alert is returned as a list of ditionaries.
     * The dictionaries will have different formats, defined by a key 'SortKey'
     * One alert comprises of more then 2 dictionaries, so inorder to get the
     * alert specific details, we have to flatted the response and groupby 'ID'.
     * as different dictionaries which represengt same alert will have same ID,
     * Once it is grouped by 'ID' we process the data. To get it in proper format.
     * dictionary with 'SortKey' status will be added in header part and
     * others will be added in data part.
     * From UI the header will be the informations which is used to user at first hand,
     * after clicking the alert the data will be shown,
     * as data represents the different levels of alert messages and time.
     * Do data is a list of messages, sent to different level for an Alert.
     */
        if((this.props.projectAlert || this.props.projectLocationList) &&
            !isEqual(this.props.projectAlert, prevProps.projectAlert)) {
            let finalDict = [], data;
            if(this.props.projectAlert)
                data = groupBy(this.props.projectAlert, 'ID');
            let SUB1, SUB2;
            if(this.props.projectLocationList) {
                let deviceResponse = this.props.projectLocationList;
                deviceResponse.map((row) => {
                    SUB1 = NAMESPACE_MAPPER[row['NS']].SUB1;
                    SUB2 = NAMESPACE_MAPPER[row['NS']].SUB2;
                    row[SUB1] =  row.SUB1;
                    row[SUB2] = row.SUB2;
                })
                if(data) {
                    Object.keys(data).map((key) => {
                        let test = {};
                        test['data'] = [];
                        data[key].map((row) => {
                            deviceResponse.map((dt) => {
                                if(dt.insid === row.InstallationID) {
                                    row.name = dt.name;
                                    row.locn = dt.locn;
                                }
                            });
                            if(row.SortKey.includes('status')) {
                                test['header'] = row;
                            } else {
                                test['data'].push(row);
                            }
                        })
                        finalDict.push(test)
                    })
                    this.showFilter = true;
                }
                let alertCount = _.pick(_.countBy(finalDict, 'header.StatusInfo.Status'),
                    ['pending', 'not_resolved', 'resolved', 'work_started', 'acknowledged']);
                alertCount['total_count'] = finalDict.length;
                this.setState({'locationList': deviceResponse,
                    alertData: orderBy(finalDict, 'header.Timestamp', 'desc'),//finalDict,
                    rangeError: '',
                    alertCount: {
                        ...this.state.alertCount,
                        ...alertCount
                    }
                    // loading: false,
                })
            }
        }

    /**
     * For loading/Progress bar this part is being used.
     */
        if(this.state.loading) {
            this.setState({
              loading: false,
            })
        }
    }

    render() {
        return(
            <AlertAnalysis stateData={this.state}
            handleChangeStart={this.handleChangeStart}
            handleChangeEnd={this.handleChangeEnd}
            getAlertData={this.getAlertData}
            setStateValue={this.setStateValue}
            showDate={true}
            showFilter={this.showFilter}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectAlert : state.ProjectAlertReducer.data,
        projectLocationList : state.DataAnalysisProjectListSubMenuReducer.data,
        projectSelected : state.projectSelectReducer.data,
    }
}

function mapDispatchToProps(dispatch) {
    //will dispatch the async action
    return {
        onProjectAlert: (config) => {
            dispatch(projectAlertList(config))
        },
        onDataAnalysisMenu: (config) => {
            dispatch(projectSubMenuList(config))
        },
        onInitialState: (config) => {
            dispatch(initialiseAlertListState(config))
            dispatch(initialiseProjectLocationState(config))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertDetails);