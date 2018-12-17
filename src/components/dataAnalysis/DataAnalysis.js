import React, { Component } from 'react';
import {withStyles, AppBar, Tabs, Tab} from '@material-ui/core';

import styles from './DataAnalysisStyle';
import AnalysisData from './AnalysisData';
import {ANALYTICS_TAB} from '../../constants/Constant';

/**
 * It is s Child component which is in turn Parent Component with Tabs setup and
 * calling child component 'AnalysisData'
 * along with passing data to that which will be used to display graphs.
 * Data is passed as input from Parent container.
 */
class DataAnalysisComponent extends Component {
    render() {
        const {classes, data, stateData, handleDateChange, handleTabChange} = this.props;
        return(
            <div className={classes.main}>
            {stateData.value &&
                <div>
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
                        <Tab label='Alert'/>
                        <Tab label='NFC Logs'/>
                        <Tab label='FD'/>
                        <Tab label='PC counter'/>
                        <Tab label='AQ Logs'/>
                        <Tab label='Wetness Detection'/>
                            {/* {Object.keys(ANALYTICS_TAB).map((key, index)=> (
                                <Tab label={ANALYTICS_TAB[key]['text']}
                                    key={ANALYTICS_TAB[key]['value']}
                                    disabled/>
                            ))} */}
                        </Tabs>
                    </AppBar>

                    {(stateData.tab === 0 || stateData.value.includes(ANALYTICS_TAB['ALERT']['key'])) && <AnalysisData
                        data={data} handleDateChange={handleDateChange}
                        stateData={stateData}/>}
                    {(stateData.tab === 1 || stateData.value.includes(ANALYTICS_TAB['NFC']['key'])) && <AnalysisData 
                        data={data} handleDateChange={handleDateChange}
                        stateData={stateData}/>}
                    {(stateData.tab === 2 || stateData.value.includes(ANALYTICS_TAB['FD']['key'])) && <AnalysisData
                        data={data} handleDateChange={handleDateChange}
                        stateData={stateData}/>}
                    {(stateData.tab === 3 || stateData.value.includes(ANALYTICS_TAB['PC']['key'])) && <AnalysisData 
                        data={data} handleDateChange={handleDateChange}
                        stateData={stateData}/>}
                    {(stateData.tab === 4 || stateData.value.includes(ANALYTICS_TAB['AQ']['key'])) && <AnalysisData 
                        data={data} handleDateChange={handleDateChange}
                        stateData={stateData}/>}
                    {(stateData.tab === 5 || stateData.value.includes(ANALYTICS_TAB['WD']['key'])) && <AnalysisData 
                        data={data} handleDateChange={handleDateChange}
                        stateData={stateData}/>}
                </div>
            }
            </div>
        )
    }
}

export default withStyles(styles)(DataAnalysisComponent);