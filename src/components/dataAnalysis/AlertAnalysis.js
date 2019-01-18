import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';

import styles from './DataAnalysisStyle';

class AlertAnalysis extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>alert Box</div>
        )
    }
}

export default withStyles(styles)(AlertAnalysis);