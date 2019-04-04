import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';

import {API_URLS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {reportServiceList} from '../actions/ReportDataAction';

import Reports from '../components/reportGeneration/Reports';
import { timingSafeEqual } from 'crypto';

class ReportView extends Component {
    constructor(props) {
        super(props);
        this.state ={
            pid: props.match.params.pid,
            serviceChecked: [-1]
        };
    }

    getReportServices = () => {
    /***
     * Call the API to get the list of services to be shown to users to download the Report.
     * The output of this API will be something like,
     * weekly, monthly yearly and so on!
     */
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['REPORTING_SERVICE']}`,
                config = getApiConfig(endPoint, 'GET');
            this.props.onReportServiceList(config);
    }

    handleServiceToggle = value => () => {
        // const { serviceChecked } = this.state,
        //     newChecked = this.createCheckList(serviceChecked, value);
        this.setState({
            serviceChecked: value,
        }, function() {
            console.log("API call for getting report list will go here")
            // const endPoint = `${API_URLS['SERVICE_REQUIREMENTS']}/${value}`,
            //     config = getApiConfig(endPoint, 'GET');
            // this.props.onServiceRequirement(config);
        });
        
    };

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
            !isEqual(this.props.projectSelected, prevProps.projectSelected)){
            if(this.state.project !== this.props.projectSelected.PID){
                this.setState({
                    pid: this.props.projectSelected.PID,
                    serviceList: ''
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
        // console.log(this.state.serviceList, !isEqual(this.props.reportServiceList, prevProps.reportServiceList));
        if (this.props.reportServiceList &&
            (!isEqual(this.props.reportServiceList, prevProps.reportServiceList) ||
            !this.state.serviceList)) {
            this.setState({serviceList: this.props.reportServiceList})
        }
    }
    render() {
        return(
            <Reports stateData={this.state}
            handleServiceToggle={this.handleServiceToggle}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        reportServiceList : state.ServiceRequirementReducer.data,
        projectSelected : state.projectSelectReducer.data,
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
        onReportServiceList: (config) => {
            dispatch(reportServiceList(config))
        }
    }
}

export default (connect)(mapStateToProps, mapDispatchToProps)(ReportView);