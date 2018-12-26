import React, { Component } from 'react';
import {withStyles, AppBar, Tabs, Tab, Paper} from '@material-ui/core';
import ReportContent from './ReportContent';
import {REPORT_TABS} from '../../constants/Constant';

import styles from './ReportGenerationStyle';

class ReportGeneration extends Component {
    
    render() {
        const {classes, stateData, handleTabChange, data,
            handleProjectSelectionChange} = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                <Paper style={{ padding: 8 * 3 }}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={stateData.tab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                            >
                            <Tab label="Location" />
                            <Tab label="Services" />
                            <Tab label="Schedule" />
                        </Tabs>
                    </AppBar>
                    {stateData.tab === 0 && <ReportContent type={REPORT_TABS['LOCATION']} data={data}
                        stateData={stateData} handleProjectSelectionChange={handleProjectSelectionChange}/>}
                    {stateData.tab === 1 && <ReportContent type={REPORT_TABS['SERVICE']}/>}
                    {stateData.tab === 2 && <ReportContent type={REPORT_TABS['SCHEDULE']}/>}
                </Paper>
            </main>
         </div>
        )
    }
}

export default withStyles(styles)(ReportGeneration);