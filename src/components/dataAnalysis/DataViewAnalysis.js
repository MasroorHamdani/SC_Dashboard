import React, { Component } from "react";
import {withStyles, GridList} from '@material-ui/core';

import {TIME_LIST} from '../../constants/Constant';
import DateRowComponent from './DateRowComponent';
import {getFormatedGraphData} from '../../utils/AnalyticsDataFormat';
import GraphPlot from './GraphPlot';

import styles from './AnalysisDataStyle';

class DataViewAnalysis extends Component {

    generateDataAnalytics = (dataAnalysis, metrics, stateData) => {
        let analyticsData = getFormatedGraphData(dataAnalysis, metrics, stateData),
            graphData = analyticsData.graphData,
            nameMapper = analyticsData.nameMapper,
            metricToUse = analyticsData.metricToUse,
            tabData = <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metricToUse}
                        stateData={stateData}/>;
        return tabData;
    }

    render() {
        const {classes, stateData, handleDatePicker,
            handleChangeStart, handleChangeEnd,
            handleListSelection} = this.props;
        let returnData;
        if(stateData.dashboardData){
            returnData = stateData.dashboardData.map((row, index) => {
                return this.generateDataAnalytics(row.dataAnalysis.metrics, row.allMetrics, stateData);
            });
        } 
        return (
            <div className={classes.paddingContent}>
                <DateRowComponent handleDatePicker={handleDatePicker}
                    handleListSelection={handleListSelection}
                    data={stateData}
                    timeList={TIME_LIST}
                    handleChangeStart={handleChangeStart}
                    handleChangeEnd={handleChangeEnd}/>
                    <GridList cellHeight={180} className={classes.gridList}>
                        {returnData ?
                            <div className={classes.flexContainer}>{returnData}</div>
                        :
                            <div className={classes.flexContainer}>No Data</div>
                        }
                    </GridList>
            </div>
        )
    }
}

export default (withStyles(styles)(DataViewAnalysis));