import React, { Component } from 'react';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core';

import styles from './PageLoaderStyle';

class PageLoader extends Component {
    render() {
        const {classes, isOpaque} = this.props;
        return <div>
            <div className={classNames(classes.overlay, isOpaque? classes.opaque : classes.transparent)
                // [classes.overlay, isOpaque? classes.opaque : classes.transparent]
                }>
                <div className={classes.spinner} />
            </div>
        </div>
    }
}

export default withStyles(styles)(PageLoader)