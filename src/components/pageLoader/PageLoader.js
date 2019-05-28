import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';

import styles from './PageLoaderStyle';

class PageLoader extends Component {
    render() {
        const {classes} = this.props;
        return <div>
            <div className={classes.overlay}>
                <div className={classes.spinner} />
            </div>
        </div>
    }
}

export default withStyles(styles)(PageLoader)