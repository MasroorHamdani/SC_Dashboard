import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';

import {API_URLS, DATE_TIME_FORMAT, RANGE_ERROR} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {reportServiceList} from '../actions/ReportDataAction';
import {reportsList} from '../actions/ReportDataAction';
import {formatDateTime, getTodaysStartDateTime} from '../utils/DateFormat';

import Reports from '../components/reportGeneration/Reports';

class ReportView extends Component {
    constructor(props) {
        super(props);
        this.state ={
            pid: props.match.params.pid,
            serviceChecked: [-1],
            startDate: getTodaysStartDateTime(),
            endDate: new Date(),
            report: [],
            serviceList: []
        };
    }

    getReportServices = () => {
    /***
     * Call the API to get the list of services to be shown to users to download the Report.
     * The output of this API will be something like,
     * weekly, monthly yearly and so on!
     */
        this.setState({
            serviceList: '',
            report: '',
            showDate: false,
            serviceChecked: [-1]
        }, function () {
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['REPORTING_SERVICE']}`,
                config = getApiConfig(endPoint, 'GET');
            this.props.onReportServiceList(config);
        })
    }

    handleServiceToggle = value => () => {
        this.setState({
            serviceChecked: value,
            showDate: true,
            startDate: getTodaysStartDateTime(),
            endDate: new Date(),
        }, function() {
           this.getServiceReports()
        });
    };

    getServiceReports = () => {
        this.setState({rangeError:'', report: ''}, function () {
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['REPORTING_LIST']}`,
                data_to_post = {
                    "ID": this.state.serviceChecked,
                    "Start": formatDateTime(this.state.startDate, DATE_TIME_FORMAT, DATE_TIME_FORMAT),
                    "End": formatDateTime(this.state.endDate, DATE_TIME_FORMAT, DATE_TIME_FORMAT)
                },
                config = getApiConfig(endPoint, 'POST', data_to_post);
            this.props.onReportList(config);
        });
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
        if(this.state.pid) {
            this.getReportServices();
        } else if(this.props.projectSelected) {
            this.setState({
                pid: this.props.projectSelected.PID
            }, function() {
                this.getReportServices();
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
    /**
     * This part will listen to project selection change from the header component.
     * On any change this will be called and the data will be changed in UI
     * Reducer used - 'projectSelectReducer'
     */
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)) {
            if(this.state.pid !== this.props.projectSelected.PID) {
                this.setState({
                    pid: this.props.projectSelected.PID,
                    serviceList: '',
                    report: ''
                }, function() {
                    this.props.history.push(this.props.projectSelected.PID);
                    this.getReportServices();
                })
            }
        }
    /**
     * On getting the Service list from API.
     * This list will be displayed to user to select the report to be downloaded from
     */
        if (this.props.reportServiceList &&
            (!isEqual(this.props.reportServiceList, prevProps.reportServiceList) ||
            !this.state.serviceList)) {
            let reportServiceList = [];
            this.props.reportServiceList.map((row) => {
                if(row['Enabled'])
                    reportServiceList.push(row);
            })
            this.setState({serviceList: reportServiceList})
        }
    /**
     * On receiving the reports list for selected service.
     */
        if (this.props.reportsList &&
            (!isEqual(this.props.reportsList, prevProps.reportsList) &&
            !this.state.report)) {
            this.setState({report: this.props.reportsList})
        }
    }
    render() {
        return(
            <Reports stateData={this.state}
            handleServiceToggle={this.handleServiceToggle}
            handleChangeStart={this.handleChangeStart}
            handleChangeEnd={this.handleChangeEnd}
            getServiceReports={this.getServiceReports}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        reportServiceList : state.ServiceRequirementReducer.data,
        projectSelected : state.projectSelectReducer.data,
        reportsList : state.ReportsListReducer.data
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
        onReportServiceList: (config) => {
            dispatch(reportServiceList(config))
        },
        onReportList: (config) => {
            dispatch(reportsList(config))
        },
    }
}

export default (connect)(mapStateToProps, mapDispatchToProps)(ReportView);