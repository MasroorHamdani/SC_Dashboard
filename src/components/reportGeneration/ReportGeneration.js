import React, { Component } from 'react';
import {withStyles, AppBar, Tabs, Tab, Paper} from '@material-ui/core';
import ReportContent from './ReportContent';
import {REPORT_TABS} from '../../constants/Constant';
import { NamespacesConsumer } from 'react-i18next';
import styles from './ReportGenerationStyle';

class ReportGeneration extends Component {
    
    render() {
        const {classes, stateData, handleTabChange, data,
            handleProjectSelectionChange, handleExpandClick,
            handleDeviceToggle, onNextClick, onPreviousClick,
            handleServiceToggle, shouldDisableCheckbox,
            onChange, generateReport} = this.props;
        return (
            <div className={classes.root}>
            <NamespacesConsumer>
            {
            t=><main className={classes.content}>
                <Paper style={{ padding: 8 * 3 }}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={stateData.tab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                            >
                            <Tab label={t('service')} />
                            <Tab label={t('location')} />
                            <Tab label={t('configure')} />
                        </Tabs>
                    </AppBar>
                    {stateData.tab === 0 && <ReportContent type={REPORT_TABS['SERVICE']} data={data}
                        handleProjectSelectionChange={handleProjectSelectionChange}
                        onPreviousClick={onPreviousClick} onNextClick={onNextClick}
                        handleServiceToggle={handleServiceToggle} stateData={stateData}/>}
                    {(stateData.tab === 1 && stateData.device && stateData.location) &&
                        <ReportContent type={REPORT_TABS['LOCATION']} data={data}
                        stateData={stateData}
                        handleExpandClick={handleExpandClick} handleDeviceToggle={handleDeviceToggle}
                        onNextClick={onNextClick} shouldDisableCheckbox={shouldDisableCheckbox}/>}
                    {stateData.tab === 2 && <ReportContent type={REPORT_TABS['CONFIGURE']}
                        onPreviousClick={onPreviousClick} stateData={stateData} data={data}
                        onChange={onChange} generateReport={generateReport}/>}
                </Paper>
            </main>
            }</NamespacesConsumer>
         </div>
        )
    }
}

export default withStyles(styles)(ReportGeneration);