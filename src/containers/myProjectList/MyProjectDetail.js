import React, {Component} from "react";
import {withStyles, LinearProgress} from '@material-ui/core';
import { connect } from "react-redux";
import _, {isEqual} from 'lodash';

import {API_URLS, PROJECT_STATUS, REACT_URLS} from '../../constants/Constant';
import {projectCreation} from  '../../actions/AdminAction'; 
import {getApiConfig} from '../../services/ApiCofig';
import {formatDateTime} from '../../utils/DateFormat';
import ProjectDescription from '../../components/projectCreation/ProjectDescription';

import styles from './MyProjectListStyle';

class MyProjectDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            parentId: props.match.params.partnerid,
            loading: true,
            projectDetail: {},
            open: false
        }
    }

    componentDidMount() {
        if(this.state.pid) {
            let endPoint = `${API_URLS['ADMIN']}/${this.state.pid}`,
                config = getApiConfig(endPoint, 'GET');
            this.props.onProjectCreation(config);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectData && 
            !isEqual(this.props.projectData, prevProps.projectData)) {
            if(this.props.projectData.status !== PROJECT_STATUS['ACTIVE'] &&
                this.props.projectData.status !== PROJECT_STATUS['REJECT'] &&
                this.props.projectData.status !== PROJECT_STATUS['DRAFT']) {
                let projectDetail = this.props.projectData;
                let email= [];
                projectDetail.general['ProjectConfig']['HealthUpdates']['Email'].map((row) => {
                    email.push(Object.values(row)[0])
                })
                projectDetail.general['Email'] = email.join()
                projectDetail.locations.map((row) => {
                    row.offtimes[0].Start = formatDateTime(row.offtimes[0].Start, "HHmm", "HH:mm");
                    row.offtimes[0].End = formatDateTime(row.offtimes[0].End, "HHmm", "HH:mm")
                })
                this.setState({
                    projectDetail: this.props.projectData,
                    loading: false
                })
            } else {
                let arr = this.props.match.url.split('/');
                let url = arr.slice(0, arr.indexOf('listproject')+1).join('/');
                this.props.history.push(url);
            }
        }
    }

    handleModalState = (type) => {
    /**
     * Handle the modal open and close state.
     * Modal shown to active/reject a new allocation.
     */
        this.setState({
            open: !this.state.open,
            type: type
        });
        if(type === PROJECT_STATUS['ACTIVE']) {
            this.setState({
                modalHeader: "Do you want to add the Project",
                showModalFooter : true,
            })
        } else if(type === PROJECT_STATUS['REJECT']) {
            this.setState({
                modalHeader: "Project Request Discarded",
                showModalFooter : true,
            })
        }
    }

    onClick = () => {
        let endPoint = `${API_URLS['ADMIN']}/${this.state.pid}`,
            dataToPost = {
                "type": "general",
                "status": this.state.type
            },
            config = getApiConfig(endPoint, 'POST', dataToPost);
        this.props.onProjectCreation(config);
        this.handleModalState();
    }

    handleEdit = (type) => {
        this.props.history.push(`${REACT_URLS.NEW_PROJECT(this.state.parentId)}/${this.state.pid}`);
    }

    render() {
        const {classes} = this.props
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                    {this.state.loading &&
                        <LinearProgress className={classes.buttonProgress}/>
                    }
                    {this.state.projectDetail &&
                        <ProjectDescription statedata={this.state}
                        handleModalState={this.handleModalState}
                        onClick={this.onClick}
                        handleEdit={this.handleEdit}/>
                    }
                </main>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectData : state.AdminReducer.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectCreation: (config) => {
            dispatch(projectCreation(config))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyProjectDetail))