import React, { Component } from 'react';
import {withStyles, Typography} from '@material-ui/core';
import {Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Brush, ComposedChart, Bar} from 'recharts';
import styles from './AnalysisDataStyle';
import {ANALYTICS_TAB, TIME_LIST,
    AUTO_REFRESH_TIMEOUT} from '../../constants/Constant';
import DateRowComponent from './DateRowComponent';
import {getFormatedGraphData} from '../../utils/AnalyticsDataFormat';
import DataProcessingComponent from './DataProcessComponent';
import _ from 'lodash';
import GraphPlot from './GraphPlot';

/**
 * Component to display Analytics details for a select Device to User
 * It will show graphical data to users.
 */
class AnalysisData extends Component {
    constructor(props) {
        super(props)
        this.state =({
            selectedIndex: 0,
            startDate: new Date(),
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
            nameMapper = analyticsData.nameMapper,
            // tabData = 'hello';
            tabData = <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metrics}
                        classes={classes}/>;
        return tabData;
    }
    render() {
        const {stateData, data, classes, handleSamplingChange,
            getMetric} = this.props;
        let tabData;
        // if (data.dataAQAnalysis && data.dataAQAnalysis.data.data.metrics &&
        // stateData.value.includes(ANALYTICS_TAB['AQ']['key']) &&  stateData.aqMetrics) {
        //     tabData = this.generateDataAnalytics(data.dataAQAnalysis.data.data.metrics, stateData.aqMetrics, classes);
        // } else if (data.dataPCAnalysis && data.dataPCAnalysis.data.data.metrics &&
        //     stateData.value.includes(ANALYTICS_TAB['PC']['key']) && stateData.pcMetrics){
        //     tabData = this.generateDataAnalytics(data.dataPCAnalysis.data.data.metrics,
        //         data.dataPCAnalysis.data.data.allMetrics,
        //         classes);
        // }
        if (data.dataPCAnalysis && data.dataPCAnalysis.data.data.metrics){
            tabData = this.generateDataAnalytics(data.dataPCAnalysis.data.data.metrics,
                data.dataPCAnalysis.data.data.allMetrics,
                classes);
        }
        return (
            <div className={classes.graph}>
                <DateRowComponent handleDatePicker={this.handleDatePicker}
                    handleChangeStart={this.handleChangeStart}
                    handleChangeEnd={this.handleChangeEnd}
                    handleListSelection={this.handleListSelection}
                    data={this.state}
                    timeList={TIME_LIST}
                    handleRefresh={this.handleRefresh}
                    />
                <DataProcessingComponent stateData={stateData}
                    handleSamplingChange={handleSamplingChange}
                    getMetric={getMetric}/>
                <div className={classes.seperator}></div>
                {tabData}
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);