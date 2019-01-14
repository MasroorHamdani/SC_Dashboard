import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';

import styles from './DataAnalysisStyle';

class DispenserAnalysis extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.main}>Dispenser Box</div>
        )
    }
}

export default withStyles(styles)(DispenserAnalysis);