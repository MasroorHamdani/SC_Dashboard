import React, {Component} from "react";
import {withStyles, LinearProgress,
    Paper, AppBar, Tabs, Tab} from '@material-ui/core';
import { connect } from "react-redux";
import _, {isEqual} from 'lodash';

import TabData from '../../components/ProjectCreation/TabData';
import {API_URLS, REACT_URLS} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectList} from  '../../actions/AdminAction';

import styles from './ProjectListStyle';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: [],
            loading: true,
            selectedPid: '',
            tabValue: 'pending',
            parentId: props.match.params.partnerid
        }
    }
    componentDidMount() {
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

    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectList && 
        !isEqual(this.props.projectList, prevProps.projectList)) {
            this.setState({projectList: this.props.projectList,
                loading: false})
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
          </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectList : state.AdminReducer.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectList: (config) => {
            dispatch(projectList(config))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectList))