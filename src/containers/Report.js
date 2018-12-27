import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import ReportGeneration from '../components/reportGeneration/ReportGeneration';
import {API_URLS, PROJECT_TABS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {dashboardData} from '../actions/DashboardAction';
import {projectDetailData} from '../actions/ProjectDataAction';
import {installationDeviceData} from '../actions/InstallationDeviceData';


class Report extends Component {
    state = ({
        tab: 0,
        project: '',
        deviceChecked: [0],
        page: 0,
        serviceChecked: [-1]
    });

    handleTabChange = (event, value) => {
        this.setState({ tab: value }, function () {
        });
    };

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
        const { deviceChecked } = this.state,
            newChecked = this.createCheckList(deviceChecked, value);
        this.setState({
            deviceChecked: newChecked,
        });
    };

    handleServiceToggle = value => () => {
        const { serviceChecked } = this.state,
            newChecked = this.createCheckList(serviceChecked, value);
        this.setState({
            serviceChecked: newChecked,
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

    onNextClick = () => {
        this.setState({tab: this.state.tab + 1});
    };

    onPreviousClick = () => {
        this.setState({tab: this.state.tab - 1});
    };

    componentDidMount(){
        const endPoint = API_URLS['DASHBOARD'],
              config = getApiConfig(endPoint, 'GET');
        this.props.onReport(config);
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.projectData.InstallationDeviceReducer.data &&
        !isEqual(this.props.projectData.InstallationDeviceReducer, prevProps.projectData.InstallationDeviceReducer)) {
            this.setState({[this.state.insid] : this.props.projectData.InstallationDeviceReducer.data[0]});
        }
    };

    render() {
        return (
            <ReportGeneration stateData={this.state}
            handleTabChange={this.handleTabChange}
            data={this.props.projectData}
            handleProjectSelectionChange={this.handleProjectSelectionChange}
            handleExpandClick={this.handleExpandClick}
            handleDeviceToggle={this.handleDeviceToggle}
            onNextClick={this.onNextClick}
            onPreviousClick={this.onPreviousClick}
            handleServiceToggle={this.handleServiceToggle}/>
        )
    }
}
function mapStateToProps(state) {
    return {
        projectData : state,
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
        }
    }
}

export default (connect)(mapStateToProps, mapDispatchToProps)(Report);