import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import styles from './AnalysisDataStyle';
import {TIME_LIST, AUTO_REFRESH_TIMEOUT} from '../../constants/Constant';
import DateRowComponent from './DateRowComponent';
import {getFormatedGraphData} from '../../utils/AnalyticsDataFormat';
import _ from 'lodash';
import GraphPlot from './GraphPlot';

/**
 * Component to display Analytics details for a select Device to User
 * It will show graphical data to users.
 */
class AnalysisData extends Component {
    constructor(props) {
        super(props)
    }
    
    handleRefresh = () => {
        this.props.handleDateChange()
    }

    componentDidMount() {
        setInterval((this.handleRefresh), AUTO_REFRESH_TIMEOUT);
    }

    generateDataAnalytics = (data, metrics, classes) => {
        let dataAnalysis = data,
            analyticsData = getFormatedGraphData(dataAnalysis, metrics),
            graphData = analyticsData.graphData,
            nameMapper = analyticsData.nameMapper, tabData;
            if(!tabData)
                tabData = <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metrics}
                        classes={classes}
                        stateData={this.props.stateData}
                        handleSamplingChange={this.props.handleSamplingChange}/>;
        return tabData;
    }
    render() {
        const {classes, stateData, handleDatePicker,
            handleChangeStart, handleListSelection,
            handleChangeEnd} = this.props;
        let tabData;
        if (stateData.dataAnalysis && stateData.dataAnalysis.data){
            tabData = this.generateDataAnalytics(stateData.dataAnalysis.data.data.metrics,
                stateData.dataAnalysis.data.data.allMetrics,
                classes);
        }
        return (
            <div className={classes.graph}>
            {stateData.deviceKey === stateData.tab &&
                <DateRowComponent handleDatePicker={handleDatePicker}
                    handleChangeStart={handleChangeStart}
                    handleChangeEnd={handleChangeEnd}
                    handleListSelection={handleListSelection}
                    data={stateData}
                    timeList={TIME_LIST}
                    handleRefresh={this.handleRefresh}
                    handleChangeRaw={this.handleChangeRaw}
                    />
            }
            {tabData}
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);