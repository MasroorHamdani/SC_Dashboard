import React, { Component } from 'react';
import {withStyles, AppBar, Tabs, Tab} from '@material-ui/core';

import styles from './DataAnalysisStyle';
import AnalysisData from './AnalysisData';
import {ANALYTICS_TABS} from '../../constants/Constant';

/**
 * It is s Child component which is in turn Parent Component with Tabs setup and
 * calling child component 'AnalysisData'
 * along with passing data to that which will be used to display graphs.
 * Data is passed as input from Parent container.
 */
class DataAnalysisComponent extends Component {
    // state = {
    //     value: 4,
    // };
    // handleChange = (event, value) => {
    //     this.setState({ value });
    // };
    render() {
        const {classes, data, stateData, handleDateChange, handleTabChange} = this.props;
        return(
            <div className={classes.main}>
                <AppBar position="static" color="default">
                    <Tabs
                    scrollable
                    scrollButtons="auto"
                    value={stateData.tab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                    >
                    <Tab label="Alerts" />
                    <Tab label="NFC Logs" />
                    <Tab label="Feedback Tablet" />
                    <Tab label="People counting sensor" />
                    <Tab label="Air quality sensor" />
                    <Tab label="Wetness Detection sensor" />
                    </Tabs>
                </AppBar>
                
                {(stateData.tab === 0 || stateData.value.includes(ANALYTICS_TABS['0'])) && <AnalysisData
                    data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {(stateData.tab === 1 || stateData.value.includes(ANALYTICS_TABS['1'])) && <AnalysisData 
                    data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {(stateData.tab === 2 || stateData.value.includes(ANALYTICS_TABS['2'])) && <AnalysisData
                    data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {(stateData.tab === 3 || stateData.value.includes(ANALYTICS_TABS['3'])) && <AnalysisData 
                    data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {(stateData.tab === 4 || stateData.value.includes(ANALYTICS_TABS['4'])) && <AnalysisData 
                    data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {(stateData.tab === 5 || stateData.value.includes(ANALYTICS_TABS['5'])) && <AnalysisData 
                    data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
            </div>
        )
    }
}

export default withStyles(styles)(DataAnalysisComponent);