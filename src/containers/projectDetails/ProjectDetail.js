import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles} from '@material-ui/core';
import {REACT_URLS} from "../../constants/Constant";
import {projectData} from '../../actions/ProjectDataAction';
import ProjectDetail from '../../components/projectDetail/ProjectDetail';
import styles from './ProjectDetailStyle';

class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            data : {},
            parentId: props.match.params.partnerid
        }
    }

    handleClick = (e, id, category) => {
    /**
     * Function called from child component to redirect the page.
     */
        this.props.history.push(`${REACT_URLS.PROJECT_DETAILS(this.state.parentId)}/${this.state.pid}/${category}/${id}`);
    };

    render() {
        const {classes} = this.props;
        return(
            <div className={classes.root}>
            {/**
            * Call the component with all the props component and other state values and function
            */}
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
    //will dispatch the async action
    return {
        onProjectData: (config) => {
            dispatch(projectData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectDetails));