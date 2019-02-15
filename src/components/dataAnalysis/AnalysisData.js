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
        let now = new Date();
        now.setHours(now.getHours()-1);
        this.state =({
            selectedIndex: 0,
            startDate: now,
            endDate: new Date(),
        })
    }
    
    handleDatePicker = () => {
        this.setState({
            selectedIndex: -1
        }, function () {
        this.props.handleDateChange('custom',
            this.state.startDate, this.state.endDate)
        })
    }
    handleRefresh = () => {
        this.props.handleDateChange()
    }
    handleChangeStart  = (date) => {
        this.setState({
            startDate: date
          });
    }
    handleChangeEnd  = (date) => {
        this.setState({
            endDate: date
          });
    }
    handleListSelection = (event, text, value) => {
        this.setState({
            selectedIndex: value
        }, function () {
            this.props.handleDateChange(text)
        })
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
        const {classes, stateData} = this.props;
        let tabData;
        if (stateData.dataAnalysis && stateData.dataAnalysis.data){
            tabData = this.generateDataAnalytics(stateData.dataAnalysis.data.data.metrics,
                stateData.dataAnalysis.data.data.allMetrics,
                classes);
        }
        return (
            <div className={classes.graph}>
            {stateData.dataAnalysis.data &&
                <DateRowComponent handleDatePicker={this.handleDatePicker}
                    handleChangeStart={this.handleChangeStart}
                    handleChangeEnd={this.handleChangeEnd}
                    handleListSelection={this.handleListSelection}
                    data={this.state}
                    timeList={TIME_LIST}
                    handleRefresh={this.handleRefresh}
                    />
            }
            {tabData}
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);