import React, {Component} from "react";
import {withStyles, LinearProgress,
    Paper, AppBar, Tabs, Tab} from '@material-ui/core';
import { connect } from "react-redux";
import _, {isEqual, isEmpty} from 'lodash';
import JWTDecode from 'jwt-decode';

import TabData from '../../components/projectCreation/TabData';
import {API_URLS, REACT_URLS, ROLES} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectList, InitialiseAdminProject} from  '../../actions/AdminAction';
import CustomPopOver from '../../components/modal/PopOver';
import {getTokenData} from '../../utils/FormatStrings';

import styles from './ProjectListStyle';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: [],
            loading: true,
            selectedPid: '',
            tabValue: 'pending',
            parentId: props.match.params.partnerid,
            authError: '',
            isAuthError: false
        }
    }

    componentDidMount() {
        let idTokenDecoded = JWTDecode(localStorage.getItem('idToken')),
            userData = getTokenData(idTokenDecoded, "Fn");
        if (userData)
            this.setState({role: userData['R']})
        let param = {
            status:'pending'
        };
        this.getProjectList(param)
    }

    getProjectList = (param) => {
        let endPoint = `${API_URLS['ADMIN']}`,
            params = param,
            config = getApiConfig(endPoint, 'GET', '', params);
        this.props.onProjectList(config);
    }

    componentWillUnmount() {
        this.props.onInitialState();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectSelected &&
            (!isEqual(this.props.projectSelected, prevProps.projectSelected) ||
            isEmpty(this.state.projectList))) {
            if(this.state.role !== ROLES['SC_ADMIN']) {
                    this.props.history.push(`${REACT_URLS.DASHBOARD(this.state.parentId)}`);
            }
        }
        if(this.props.projectList && 
            !isEqual(this.props.projectList, prevProps.projectList)) {
            if(this.props.projectList['Message']) {
                this.setState({
                    loading: false,
                    authError: this.props.projectList['Message'],
                    isAuthError: true
                });
            } else if(!isEmpty(this.props.projectList)) {
                this.setState({
                    projectList: this.props.projectList,
                    loading: false
                })
            }
        }
    }

    handleChange = (event, value) => {
        this.setState({
            selectedPid : value
        }, function() {
            this.props.history.push(`${REACT_URLS.PROJECT_LIST(this.state.parentId)}/${this.state.selectedPid}`);
        })
    }

    handleTabChange = (event, value) => {
        this.props.onInitialState()
        this.setState({
            loading: true,
            tabValue : value
        }, function(){
            let param = {
                status: value
            };
            this.getProjectList(param)
        })
    }

    handleClose = () => {
        this.setState({
          authError: '',
          isAuthError: false
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                    {this.state.loading &&
                        <LinearProgress className={classes.buttonProgress}/>
                    }
                    <Paper style={{ padding: 8 * 3 }}>
                        <AppBar position="static" color="default">
                            <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth">
                            <Tab label='Pending'
                                value='pending'/>
                            <Tab label='Active'
                                value='active'/>
                            <Tab label='Reject'
                                value='reject'/>
                            </Tabs>
                        </AppBar>
                        {this.state.tabValue &&
                            <TabData stateData={this.state}
                                handleChange={this.handleChange}/>
                        }
                    </Paper>
                </main>
                {this.state.isAuthError &&
                    <CustomPopOver content={this.state.authError} open={this.state.isAuthError}
                        handleClose={this.handleClose} variant='error'/>
                }
          </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectList : state.AdminReducer.data,
        projectSelected : state.projectSelectReducer.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectList: (config) => {
            dispatch(projectList(config))
        },
        onInitialState: () => {
            dispatch(InitialiseAdminProject())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectList))