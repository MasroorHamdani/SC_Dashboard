import React, {Component} from 'react';
import {connect} from 'react-redux';
import {isEqual, groupBy} from 'lodash';

import {API_URLS} from '../constants/Constant';
import {healthDataSaved} from '../actions/HealthStatus';
import {installationDeviceData} from '../actions/InstallationDeviceData';
import {projectInstallationList} from '../actions/DataAnalysis';
import {getApiConfig} from '../services/ApiCofig';

import HealthStatusComponent from '../components/healthCheck/HealthStatusComponent';

class HealthStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            insid: props.match.params.insid
        };
    }

    componentDidMount() {
    /**
     * Check id pid and timezone are present in state,
     * if yes get the data by calling internal functions,
     * or set the value first and then make the call.
     */
        this.getHealthDeatails();
        this.getLocationDetails();
    }

    getHealthDeatails = () => {
    /***
     * Call Health API and get the health data
     */
        // const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['HEALTH']}/${this.state.insid}`,
        //         config = getApiConfig(endPoint, 'GET');
        // this.props.onHealthDataSave(this.state.healthData);
        let data = [
            {
                "ID": "CERTIS_PT_CCK_T2",
                "PID": "CERTIS_CCK_MRT",
                "info": {
                    "last_ping": "20190312145500",
                    "last_ping_since": 76632,
                    "pid": "CERTIS_CCK_MRT",
                    "sampling_rate": 120,
                    "status": "healthy",
                    "type": "PT",
                    "insid": "CERTIS_CCK_LOCN2"
                }
            },
            {
                "ID": "CERTIS_PT_CCK_T3",
                "PID": "CERTIS_CCK_MRT",
                "info": {
                    "last_ping": "20190312145500",
                    "last_ping_since": 76632,
                    "pid": "CERTIS_CCK_MRT",
                    "sampling_rate": 120,
                    "status": "unhealthy",
                    "type": "PT",
                    "insid": "CERTIS_CCK_LOCN2"
                }
            },
            {
                "ID": "CERTIS_PT_CCK_T4",
                "PID": "CERTIS_CCK_MRT",
                "info": {
                    "last_ping": "20190312145500",
                    "last_ping_since": 76632,
                    "pid": "CERTIS_CCK_MRT",
                    "sampling_rate": 120,
                    "status": "warning",
                    "type": "PT",
                    "insid": "CERTIS_CCK_LOCN2"
                }
            },
            {
                "ID": "CERTIS_PT_CCK_T5",
                "PID": "CERTIS_CCK_MRT",
                "info": {
                    "last_ping": "20190312145500",
                    "last_ping_since": 76632,
                    "pid": "CERTIS_CCK_MRT",
                    "sampling_rate": 120,
                    "status": "unhealthy",
                    "type": "PT",
                    "insid": "CERTIS_CCK_LOCN2"
                }
            },
            {
                "ID": "CERTIS_AQ_CCK_T2",
                "PID": "CERTIS_CCK_MRT",
                "info": {
                    "last_ping": "20190312145500",
                    "last_ping_since": 76632,
                    "pid": "CERTIS_CCK_MRT",
                    "sampling_rate": 120,
                    "status": "healthy",
                    "type": "AQ",
                    "insid": "CERTIS_CCK_LOCN2"
                }
            },
            {
                "ID": "CERTIS_PC_CCK_T2",
                "PID": "CERTIS_CCK_MRT",
                "info": {
                    "last_ping": "20190312145500",
                    "last_ping_since": 10000,
                    "pid": "CERTIS_CCK_MRT",
                    "sampling_rate": 120,
                    "status": "warning",
                    "type": "PC",
                    "insid": "CERTIS_CCK_LOCN2"
                }
            }
        ]
        this.setState({data: data}, function() {
            this.formatHealthData();
        })
        
    }

    getLocationDetails = () => {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['WASHROOM_LOCATION']}/${this.state.insid}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onInstallationDetail(config);
    }

    formatHealthData = () => {
        let formattedData = groupBy(this.state.data,  'info.type');
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
            this.setState({pid: this.props.projectSelected.PID},
                function() {
                this.props.history.push(this.props.projectSelected.PID);
                this.getHealthDeatails();
            });
        }

        // if (this.props.healthStatus &&
        //     !isEqual(this.props.healthStatus, prevProps.healthStatus)) {
        //         // console.log(this.props.healthStatus);
        // }
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
            !isEqual(this.props.installationList, prevProps.installationList)) {
                let installationList = groupBy(this.props.installationList,  'Devid');
                Object.keys(this.state.formattedData).map((key) => {
                    this.state.formattedData[key].map((row) => {
                        if(installationList[row.ID]) {
                            row.info['name'] = installationList[row.ID][0]['Display'];
                        }
                    })
                })
        }
    }
    render() {
        return <HealthStatusComponent stateData={this.state}/>
    }
}

function mapStateToProps(state) {
    return {
        healthStatus: state.healthStatusReducer.data,
        installationDetail: state.InstallationDeviceReducer.data,
        installationList : state.DataAnalysisInstallationListReducer.data,
    }
}
function mapDispatchToProps(dispatch) {
    // Will dispatch the async action
    return {
        onInstallationDetail: (config) => {
            dispatch(installationDeviceData(config))
        },
        onHealthDataSave: (value) => {
            dispatch(healthDataSaved(value))
        },
        onInstalationsList: (config) => {
            dispatch(projectInstallationList(config))
        },
    }
}

export default (connect)(mapStateToProps, mapDispatchToProps)(HealthStatus);;