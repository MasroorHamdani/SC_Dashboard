import React, { Component } from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";
import {API_URLS, X_API_KEY, REACT_URLS, PROJECT_TABS} from "../constants/Constant";
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
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/general`,
            config = getApiConfig(endPoint, '', 'GET');
        this.props.onProjectData(config);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.projectData.ProjectDataReducer.data &&
            !isEqual(this.props.projectData.ProjectDataReducer.data !== prevProps.projectData.ProjectDataReducer.data)) {
                console.log(this.props.projectData.ProjectDataReducer.data, "*****");
            }
    }

    handleClick = (e, id, category) => {
        this.props.history.push(`${REACT_URLS['PROJECT_DETAILS']}/${this.state.pid}/${category}/${id}`);
      };

    render() {
        return(
            <div>
            { this.props.projectData.ProjectDataReducer.data &&
                <ProjectDetail data={this.props.projectData.ProjectDataReducer.data[0]}
                handleClick={this.handleClick}/>
            }
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
        onProjectData: (config) => {
            //will dispatch the async action
            dispatch(projectData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);