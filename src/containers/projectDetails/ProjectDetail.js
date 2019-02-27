import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles} from '@material-ui/core';
import {isEqual} from 'lodash';
import {REACT_URLS} from "../../constants/Constant";
import {projectData} from '../../actions/ProjectDataAction';
import ProjectDetail from '../../components/projectDetail/ProjectDetail';
import styles from './ProjectDetailStyle';

class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            data : {}
        }
    }

    handleClick = (e, id, category) => {
        this.props.history.push(`${REACT_URLS['PROJECT_DETAILS']}/${this.state.pid}/${category}/${id}`);
    };

    render() {
        const {classes} = this.props;
        return(
            <div className={classes.root}>
                <ProjectDetail {...this.props}
                stateData={this.state}
                handleClick={this.handleClick}/>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        projectData : state.ProjectDataReducer.data,
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
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectDetails));