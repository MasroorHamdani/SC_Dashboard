import React, {Component} from 'react';
import {connect} from 'react-redux';
import {isEqual, groupBy} from 'lodash';

import {API_URLS, NAMESPACE_MAPPER, REACT_URLS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import HealthCheck from '../components/healthCheck/HealthCheck';
import {projectSubMenuList} from '../actions/DataAnalysis';


class Health extends Component {
/**
 * Health Check View for sensor devices
 */
    constructor(props) {
        super(props);
        this.state ={
            pid: props.match.params.pid,
        };
    }
    componentDidMount() {
    /**
     * Check id pid and timezone are present in state,
     * if yes get the data by calling internal functions,
     * or set the value first and then make the call.
     */
        this.getHealthDeatails();
        // if(this.state.pid){
        //     this.getHealthDeatails();
        // } else if(this.props.projectSelected) {
        //     this.setState({
        //         pid: this.props.projectSelected.PID},
        //     function() {
        //         this.getHealthDeatails();
        //     });
        // }
    }
    getHealthDeatails = () => {
    /***
     * Call Health API and get the health data
     */
        let data = [
            {
                "ID": "CERTIS_AQ_CCK_T1",
                "PID": "CERTIS_CCK_MRT",
                "info": {
                    "last_ping": "20190312145500",
                    "last_ping_since": 76632,
                    "pid": "CERTIS_CCK_MRT",
                    "sampling_rate": 120,
                    "status": "unhealthy",
                    "type": "AQ",
                    "insid": "CERTIS_CCK_LOCN1"
                }
            },
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
        this.setState({data: data})
        this.getLocationDetails()
    }

    getLocationDetails = () => {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['WASHROOM_LOCATION']}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onProjectInstallationList(config);
    }

    calculateStatus = (formattedData) => {
        Object.keys(formattedData).map((key) => {
            Object.keys(formattedData[key]).map((innerKey) => {
                let deviceNumber = formattedData[key][innerKey].length;
                let status = {};
                formattedData[key][innerKey].map((row) => {
                    status[row.info.status] = status[row.info.status] ? status[row.info.status] + 1 : 1;
                })
                Object.keys(status).map((index) => {
                    status[index] = (status[index]/deviceNumber) * 100;
                })
                formattedData[key][innerKey].push({'status': status})
            })
        })
        return formattedData;
    }

    formatHealthData = (deviceResponse) => {
        let formattedData = groupBy(this.state.data,  'info.insid');
        Object.keys(formattedData).map((key) => {
            formattedData[key] = groupBy(formattedData[key],  'info.type');
        })
        deviceResponse.map((row) => {
            if(formattedData[row.insid]) {
                Object.keys(formattedData[row.insid]).map((key) => {
                    formattedData[row.insid][key].map((dt) => {
                        dt.info.locn = row.locn;
                        dt.info.name = row.name;
                    })
                })
            }
        })
        formattedData = this.calculateStatus(formattedData);
        this.setState({healthData: formattedData})
    }

    handleClick = (e, id, category) => {
        /**
         * Function called from child component to redirect the page.
         */
        // this.props.history.push(id);
        this.props.history.push(`${REACT_URLS['HEALTH_STATUS']}/${this.state.pid}/${id}`);
    };
    
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

        if (this.props.projectInstallationList &&
            !isEqual(this.props.projectInstallationList, prevProps.projectInstallationList)) {
                let SUB1, SUB2;;
                const deviceResponse = this.props.projectInstallationList;
                deviceResponse.map((row) => {
                    SUB1 = NAMESPACE_MAPPER[row['NS']].SUB1;
                    SUB2 = NAMESPACE_MAPPER[row['NS']].SUB2;
                    row[SUB1] =  row.SUB1;
                    row[SUB2] = row.SUB2;
                })
                this.formatHealthData(deviceResponse)
        }
    }

    render() {
        return <HealthCheck stateData={this.state}
            handleClick={this.handleClick}
            />
    }
}
function mapStateToProps(state) {
    return {
        projectSelected : state.projectSelectReducer.data,
        projectInstallationList : state.DataAnalysisProjectListSubMenuReducer.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectInstallationList: (config) => {
            dispatch(projectSubMenuList(config))
        },
    }
}
export default (connect)(mapStateToProps, mapDispatchToProps)(Health);