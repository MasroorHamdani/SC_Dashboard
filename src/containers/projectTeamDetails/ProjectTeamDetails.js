import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import styles from './ProjectTeamDetailsStyle';

class ProjectInstallationDetails extends Component {
    render(){
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                <div>Team Details</div>
                </main>
            </div>
        )
    }
}
export default withStyles(styles)(ProjectInstallationDetails);