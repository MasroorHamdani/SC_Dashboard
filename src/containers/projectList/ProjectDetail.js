import React, {Component} from "react";
import {withStyles, LinearProgress, Typography} from '@material-ui/core';
import { connect } from "react-redux";
import _, {isEqual, isEmpty} from 'lodash';
import JWTDecode from 'jwt-decode';

import {API_URLS, PROJECT_STATUS, ROLES,
    REACT_URLS} from '../../constants/Constant';
import {projectCreation} from  '../../actions/AdminAction'; 
import {getApiConfig} from '../../services/ApiCofig';
import {formatDateTime} from '../../utils/DateFormat';
import ProjectDescription from '../../components/projectCreation/ProjectDescription';
import {getTokenData} from '../../utils/FormatStrings';
import CustomPopOver from '../../components/modal/PopOver';

import styles from './ProjectListStyle';

class ProjectDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            loading: true,
            projectDetail: {},
            open: false,
            authError: '',
            isAuthError: false
        }
    }

    componentDidMount() {
        let idTokenDecoded = JWTDecode(localStorage.getItem('idToken')),
            userData = getTokenData(idTokenDecoded, "Fn");
        if (userData)
            this.setState({role: userData['R']})
        if(this.state.pid) {
            let endPoint = `${API_URLS['ADMIN']}/${this.state.pid}`,
                config = getApiConfig(endPoint, 'GET');
            this.props.onProjectCreation(config);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectSelected &&
            !isEqual(this.props.projectSelected, prevProps.projectSelected)) {
            if(this.state.role !== ROLES['SC_ADMIN']) {
                    this.props.history.push(`${REACT_URLS.DASHBOARD(this.state.parentId)}`);
            }
        }
        if(!isEmpty(this.props.projectData) && 
            !isEqual(this.props.projectData, prevProps.projectData)) {
            if(this.props.projectData.status && this.props.projectData.status === 400) {
                this.setState({
                    loading: false,
                    authError: this.props.projectData.data['Message'],
                    isAuthError: true
                });
            } else {
                if(this.props.projectData.status !== PROJECT_STATUS['ACTIVE'] &&
                    this.props.projectData.status !== PROJECT_STATUS['REJECT']) {
                    let projectDetail = this.props.projectData;
                    let email= [];
                    if(projectDetail.general['ProjectConfig'])
                        projectDetail.general['ProjectConfig']['HealthUpdates']['Email'].map((row) => {
                            email.push(Object.values(row)[0])
                        })
                    projectDetail.general['Email'] = email.join();
                    projectDetail.general['partner_id'] = projectDetail.general['SUB3']
                    projectDetail.locations.map((row) => {
                        if(!isEmpty(row.offtimes)) {
                            row.offtimes[0].Start = formatDateTime(row.offtimes[0].Start, "HHmm", "HH:mm");
                            row.offtimes[0].End = formatDateTime(row.offtimes[0].End, "HHmm", "HH:mm");
                        }
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
                "status": this.state.type,
                "createdBy" : this.state.projectDetail.general.CreatedBy
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
                        handleEdit={this.handleEdit}
                        projectSelected={this.props.projectSelected}/>
                    }
                    {this.state.isAuthError &&
                        <CustomPopOver content={this.state.authError} open={this.state.isAuthError}
                        handleClose={this.handleClose} variant='error'/>
                    }
                </main>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectData : state.AdminReducer.data,
        projectSelected : state.projectSelectReducer.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectCreation: (config) => {
            dispatch(projectCreation(config))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectDetail))