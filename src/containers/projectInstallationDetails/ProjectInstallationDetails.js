import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import styles from './ProjectInstallationDetailsStyle';

class ProjectInstallationDetails extends Component {
    render(){
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                <div>Helo World</div>
                </main>
            </div>
        )
    }
}
export default withStyles(styles)(ProjectInstallationDetails);