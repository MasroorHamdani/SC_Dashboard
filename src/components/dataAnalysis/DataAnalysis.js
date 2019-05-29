import React, { Component } from 'react';
import {withStyles, AppBar, Tabs, Tab} from '@material-ui/core';
import {isEmpty} from 'lodash';
import styles from './DataAnalysisStyle';
import AnalysisData from './AnalysisData';

/**
 * It is s Child component which is in turn Parent Component with Tabs setup and
 * calling child component 'AnalysisData'
 * along with passing data to that which will be used to display graphs.
 * Data is passed as input from Parent container.
 */
class DataAnalysisComponent extends Component {
    constructor(props) {
        super(props)
        this.info = false;
    }
    render() {
        const {classes, stateData, handleDateChange,
            handleTabChange, handleSamplingChange,
            handleDatePicker, handleChangeStart,
            handleListSelection, handleChangeEnd,
            refreshData, handleBarClick, getModalAnalyticsDataWithMetricId,
            modalHandleChangeStart, modalHandleChangeEnd} = this.props;
        return(
            <div className={classes.main}>
                <div>
                    {(stateData.value && !isEmpty(stateData.installationList)) &&
                        <AppBar position="static" color="default">
                            <Tabs
                            scrollable
                            scrollButtons="auto"
                            value={stateData.tab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth">
                            {/* Object.keys(stateData.installationList).map((key)=> { */}
                                {stateData.installationList.map((row)=> {
                                    if(stateData.installationList && !this.info) {
                                        this.info = true;
                                        handleTabChange('', row.key)
                                    }
                                    return <Tab label={Array.isArray(row) ? row[0]['text']: row['text']}
                                        value={Array.isArray(row) ? row[0]['key']: row['key']}
                                        key={Array.isArray(row) ? row[0]['key']: row['key']}/>
                                        // stateData.installationList[key]
                                })}
                            </Tabs>
                        </AppBar>
                    }
                    {stateData.tab &&
                        <AnalysisData 
                        handleDateChange={handleDateChange}
                        stateData={stateData} handleSamplingChange={handleSamplingChange}
                        handleDatePicker={handleDatePicker}
                        handleChangeStart={handleChangeStart}
                        handleListSelection={handleListSelection}
                        handleChangeEnd={handleChangeEnd}
                        refreshData={refreshData}
                        handleBarClick={handleBarClick}
                        getModalAnalyticsDataWithMetricId={getModalAnalyticsDataWithMetricId}
                        modalHandleChangeStart={modalHandleChangeStart}
                        modalHandleChangeEnd={modalHandleChangeEnd}/>
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(DataAnalysisComponent);