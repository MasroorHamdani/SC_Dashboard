import React, { Component } from 'react';
import {connect} from 'react-redux';
import ReportGeneration from '../components/reportGeneration/ReportGeneration';
import {API_URLS, PROJECT_TABS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {dashboardData} from '../actions/DashboardAction';
import {projectDetailData} from '../actions/ProjectDataAction';

class Report extends Component {
    state = ({
        tab: 0,
        project: ''
    });
    handleTabChange = (event, value) => {
        this.setState({ tab: value }, function () {
        });
    };
    handleProjectSelectionChange = event => {
        this.setState({project: event.target.value}, function() {
            this.getLocations();
        });
    };
    getLocations() {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.project}/${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`,
        config = getApiConfig(endPoint, 'GET');
      this.props.onProjectDetailData(config);
    }
    componentDidMount(){
        const endPoint = API_URLS['DASHBOARD'],
              config = getApiConfig(endPoint, 'GET');
        this.props.onReport(config);
      }
    render() {
        return (
            <div>
               <ReportGeneration stateData={this.state}
               handleTabChange={this.handleTabChange}
               data={this.props.projectData}
               handleProjectSelectionChange={this.handleProjectSelectionChange}/>
            </div>
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
        }
    }
  }

export default (connect)(mapStateToProps, mapDispatchToProps)(Report);