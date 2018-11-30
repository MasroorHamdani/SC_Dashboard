import React, { Component } from 'react';
import { connect } from "react-redux";

import {API_URLS, X_API_KEY} from "../constants/Constant";
import {getApiConfig} from "../services/ApiCofig";
import {projectData} from '../actions/ProjectDataAction';
import ProjectDetail from '../components/projectDetail/ProjectDetail';

class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            data : {}
        }
    }
    componentDidMount(){
        const endPoint = API_URLS['PROJECT_DETAILS'],
            dataToPost = {
                "pid": this.state.pid
            },
            config = getApiConfig(endPoint, X_API_KEY, 'POST', dataToPost);
        this.props.onProjectData(config);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.projectData.ProjectDataReducer.data &&
            this.props.projectData.ProjectDataReducer.data !== prevProps.projectData.ProjectDataReducer.data) {
                console.log(this.props.projectData.ProjectDataReducer.data, "*****");
            }
    }
    render() {
        return(
            <ProjectDetail/>
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
        onProjectData: (config) => {
            //will dispatch the async action
            dispatch(projectData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);