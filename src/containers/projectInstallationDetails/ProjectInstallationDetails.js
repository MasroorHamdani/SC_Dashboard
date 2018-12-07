import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import styles from './ProjectInstallationDetailsStyle';

import {PROJECT_TABS, API_URLS} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';

class ProjectInstallationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            insid: props.match.params.insid
        }
    }
    componentDidMount() {
        console.log(this.state.pid, this.state.insid);
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
            ${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DEVICES']}/${this.state.insid}`,
            config = getApiConfig(endPoint, 'GET');
        console.log(config, "config");
        // this.props.onProjectData(config);
    }
    render(){
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                <div>Installation Details</div>
                </main>
            </div>
        )
    }
}
export default withStyles(styles)(ProjectInstallationDetails);