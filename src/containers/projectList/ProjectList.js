import React, {Component} from "react";
import {withStyles,
    Paper, AppBar, Tabs, Tab} from '@material-ui/core';
import { connect } from "react-redux";
import _, {isEqual} from 'lodash';

import TabData from './TabData';
import {API_URLS} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectList} from  '../../actions/AdminAction';

import styles from './ProjectListStyle';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: [],
            selectedPid: '',
            tabValue: 'pending'
        }
    }
    componentDidMount() {
        let endPoint = `${API_URLS['ADMIN']}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onProjectList(config);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectList && 
        !isEqual(this.props.projectList, prevProps.projectList)) {
            console.log(this.props.projectList)
            // let projList = []
            // this.props.projectList.map((row) => {
            //     projList['id'] = row['PID']
            // })
            this.setState({projectList: this.props.projectList})
        }
    }

    handleChange = (event) => {
        this.setState({
            // loading: true,
            selectedPid : event.target.value
        })
    }
    handleTabChange = (event, value) => {
        this.setState({
            // loading: true,
            tabValue : value
        })
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
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
        // onProjectUpdate: (config) => {
        //     dispatch(projectUpdate(config))
        // }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectList))