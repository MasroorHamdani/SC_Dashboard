import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import ReportGeneration from '../components/reportGeneration/ReportGeneration';
import {API_URLS, PROJECT_TABS, SERVICE_ATTR,
    SERVICE_TABS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {dashboardData} from '../actions/DashboardAction';
import {projectDetailData} from '../actions/ProjectDataAction';
import {installationDeviceData} from '../actions/InstallationDeviceData';
import {serviceRequirementData} from '../actions/ReportDataAction';


class Report extends Component {
    state = ({
        tab: 0,
        project: '',
        serviceChecked: [-1]
    });

    handleTabChange = (event, value) => {
        this.setState({ tab: value }, function () {
        });
    };
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        });

    }
    handleProjectSelectionChange = event => {
        // Either remove condition and let user select default 'Select Project' Option 
        // and make an API call with empty value
        // Or have this condotion added whcih won't user select the default empty option back.
        if(event.target.value) {
            this.setState({project: event.target.value}, function() {
                this.getLocations();
            });
        }
    };

    getLocations() {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.project}/${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onProjectDetailData(config);
    };

    handleExpandClick = (index, insid, pid) => {
        this.setState(state => ({ [index]: !state[index],
                                    insid : insid }));
        if(!this.state[insid]) {
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${pid}/
                ${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DEVICES']}/${insid}`,
                config = getApiConfig(endPoint, 'GET');
            this.props.onProjectInstallationData(config);
        }
    };

    handleDeviceToggle = value => () => {
        const device = {...this.state.device},
            {Key} = this.state.device,
            deviceSelected = device[Key],
            newChecked = this.createCheckList(deviceSelected, value);

        if(!this.shouldDisableCheckbox(value) || newChecked.length < deviceSelected.length) {
            device[Key] = newChecked;
            this.setState({device});
        }
    };

    handleServiceToggle = value => () => {
        // const { serviceChecked } = this.state,
        //     newChecked = this.createCheckList(serviceChecked, value);
        this.setState({
            serviceChecked: value,
        }, function() {
            const endPoint = `${API_URLS['SERVICE_REQUIREMENTS']}/${value}`,
                config = getApiConfig(endPoint, 'GET');
            this.props.onServiceRequirement(config);
        });
        
    };

    createCheckList(checkType, value) {
        const currentIndex = checkType.indexOf(value),
        newChecked = [...checkType];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        return newChecked;
    }

    shouldDisableCheckbox = value => {
        const maxDeviceAllowed = this.state.device['Max'];
        const {Key} = this.state.device;
        return this.state.device[Key].length >= maxDeviceAllowed //&& deviceChecked.indexOf(value) === -1;
    }

    onNextClick = () => {
        this.setState({tab: this.state.tab + 1});
    };

    onPreviousClick = () => {
        this.setState({tab: this.state.tab - 1});
    };

    generateReport = () => {
        // console.log("generate report function");
    }
    componentDidMount(){
        const endPoint = API_URLS['DASHBOARD'],
              config = getApiConfig(endPoint, 'GET');
        this.props.onReport(config);
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.installationDevice &&
        !isEqual(this.props.installationDevice, prevProps.installationDevice)) {
            this.setState({[this.state.insid] : this.props.installationDevice[0]});
        }
        if (this.props.serviceRequirements &&
        !isEqual(this.props.serviceRequirements, prevProps.serviceRequirements)) {
            this.props.serviceRequirements.map((row) => {
                if(row.ATTR.includes(SERVICE_ATTR['INPUT'])) {
                    this.setState({inputFields: row.data})
                    row.data.map((dt) => {
                        if(dt.Key === SERVICE_TABS['DEVICE']) {
                            dt[dt.Key] = [];
                            this.setState({'device': dt})
                        }
                        else if(dt.Key === SERVICE_TABS['LOCATION']) {
                            this.setState({'location': dt})
                        }
                    })
                } else if(row.ATTR.includes(SERVICE_ATTR['OUTPUT'])) {
                    this.setState({outputFields: row.data})
                }
            });
        }
    };

    render() {
        return (
            <ReportGeneration stateData={this.state}
            handleTabChange={this.handleTabChange}
            data={this.props}
            handleProjectSelectionChange={this.handleProjectSelectionChange}
            handleExpandClick={this.handleExpandClick}
            handleDeviceToggle={this.handleDeviceToggle}
            onNextClick={this.onNextClick}
            onPreviousClick={this.onPreviousClick}
            handleServiceToggle={this.handleServiceToggle}
            shouldDisableCheckbox={this.shouldDisableCheckbox}
            onChange={this.handleChange}
            generateReport={this.generateReport}/>
        )
    }
}
function mapStateToProps(state) {
    return {
        installationDevice : state.InstallationDeviceReducer.data,
        projectList : state.DashboardReducer.data,
        projectDetails : state.ProjectDetailsReducer.data,
        serviceRequirements : state.ServiceRequirementReducer.data
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
        onReport: (config) => {
            //will dispatch the async action
            dispatch(dashboardData(config))
        },
        onProjectDetailData: (config) => {
            dispatch(projectDetailData(config))
        },
        onProjectInstallationData: (config) => {
            dispatch(installationDeviceData(config))
        },
        onServiceRequirement: (config) => {
            dispatch(serviceRequirementData(config))
        }
    }
}

export default (connect)(mapStateToProps, mapDispatchToProps)(Report);