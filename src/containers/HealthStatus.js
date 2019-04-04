import React, {Component} from 'react';
import {connect} from 'react-redux';
import {isEqual, groupBy} from 'lodash';

import {API_URLS} from '../constants/Constant';
import {projectLocationHealth} from '../actions/HealthStatus';
import {installationDeviceData} from '../actions/InstallationDeviceData';
import {projectInstallationList} from '../actions/DataAnalysis';
import {getApiConfig} from '../services/ApiCofig';

import HealthStatusComponent from '../components/healthCheck/HealthStatusComponent';

class HealthStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            insid: props.match.params.insid,
            loading: true
        };
        this.installationData = false;
    }

    componentDidMount() {
    /**
     * Check id pid and timezone are present in state,
     * if yes get the data by calling internal functions,
     * or set the value first and then make the call.
     */
        this.getHealthDetails();
    }

    getHealthDetails = () => {
    /***
     * Call Health API and get the health data
     */
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['HEALTH']}/${this.state.insid}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onHealthLocation(config);
    }

    getLocationDetails = () => {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['WASHROOM_LOCATION']}/${this.state.insid}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onInstallationDetail(config);
    }

    formatHealthData = () => {
        let formattedData = groupBy(this.state.data, 'info.type');
        this.setState({formattedData:formattedData});
    }

    componentDidUpdate(prevProps, prevState) {
    /**
     * This part will listen to project selection change from the header component.
     * On any change this will be called and the data will be changed in UI
     * Reducer used - 'projectSelectReducer'
     */
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)){
            if(this.state.pid !== this.props.projectSelected.PID)
            this.setState({
                pid: this.props.projectSelected.PID,
                loading: true
            }, function() {
                let arr = this.props.match.url.split('/');
                arr[3] = this.props.projectSelected.PID;
                let url = arr.slice(0,4).join('/');
                this.props.history.push(url);
            });
        }

        if (this.props.healthStatusLocation &&
            (!isEqual(this.props.healthStatusLocation, prevProps.healthStatusLocation) ||
            !this.state.formattedData)) {
            this.setState({data: this.props.healthStatusLocation}, function() {
                this.formatHealthData();
                this.getLocationDetails();
            })
        }

        if (this.props.installationDetail &&
            (!isEqual(this.props.installationDetail, prevProps.installationDetail) ||
            !this.state.name)) {
            this.setState({
                name: this.props.installationDetail[0].name,
                locn: this.props.installationDetail[0].locn
            })
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['PROJECT_LOCATION']}/${this.state.insid}`,
                params = {
                    'getinsinfo' : false
                },
                config = getApiConfig(endPoint, 'GET', '', params);
            this.props.onInstalationsList(config);
        }

        if (this.props.installationList &&
            (!isEqual(this.props.installationList, prevProps.installationList) ||
            !this.installationData) && this.state.formattedData) {
            let installationList = groupBy(this.props.installationList,  'Devid');
            Object.keys(this.state.formattedData).map((key) => {
                this.state.formattedData[key].map((row) => {
                    if(installationList[row.ID]) {
                        row.info['name'] = installationList[row.ID][0]['Display'];
                    }
                })
            })
            this.installationData = true
            this.setState({stateUpdated: true,
                loading: false})
        }
    }

    render() {
        return <HealthStatusComponent stateData={this.state}/>
    }
}

function mapStateToProps(state) {
    return {
        healthStatusLocation: state.HealthtSatusLocationSReducer.data,
        installationDetail: state.InstallationDeviceReducer.data,
        installationList : state.DataAnalysisInstallationListReducer.data,
        projectSelected : state.projectSelectReducer.data,
    }
}
function mapDispatchToProps(dispatch) {
    // Will dispatch the async action
    return {
        onInstallationDetail: (config) => {
            dispatch(installationDeviceData(config))
        },
        onHealthLocation: (value) => {
            dispatch(projectLocationHealth(value))
        },
        onInstalationsList: (config) => {
            dispatch(projectInstallationList(config))
        },
    }
}

export default (connect)(mapStateToProps, mapDispatchToProps)(HealthStatus);;