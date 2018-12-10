import React, { Component } from 'react';
import {withStyles, List} from '@material-ui/core';


import styles from './DataAnalysisStyle';

class DataAnalysisComponent extends Component {
    render() {
        const {classes, menuList} = this.props;
        return(
            <div className={classes.root}>
                <main className={classes.content}>
                    <List></List>
                    <span>Data DataAnalysis</span>
                </main>
            </div>
        )
    }
}

export default withStyles(styles)(DataAnalysisComponent);