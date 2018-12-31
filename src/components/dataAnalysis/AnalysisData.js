import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Brush, ComposedChart, Bar} from 'recharts';
import styles from './AnalysisDataStyle';
import {ANALYTICS_TAB, TIME_LIST,
    AUTO_REFRESH_TIMEOUT} from '../../constants/Constant';
import DateRowComponent from './DateRowComponent';
import {getFormatedGraphData} from '../../utils/AnalyticsDataFormat';
import DataProcessingComponent from './DataProcessComponent';
import _ from 'lodash';

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
            endDate: new Date()
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
    render() {
        const {stateData, data, classes} = this.props;
        let tabData;
        if (data.dataAQAnalysis &&
        stateData.value.includes(ANALYTICS_TAB['AQ']['key']) && stateData.aqMetrics['vector']) {
            let dataAnalysis = data.dataAQAnalysis;
            let analyticsData = getFormatedGraphData(dataAnalysis, stateData.aqMetrics);
            let graphData = analyticsData.graphData,
            nameMapper = analyticsData.nameMapper;
            tabData = <ResponsiveContainer width='100%' height={400}>
                    <LineChart className={classes.lineChart} data={graphData}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <XAxis dataKey="name" minTickGap={20}
                            label={{ value: 'Time of day', position: 'insideBottomRight', offset: 0}}/>
                        <YAxis label={{ value: 'Concentration (ppm)', angle: -90, position: 'insideLeft'}}
                        />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        <Brush dataKey='name' height={30} stroke="#8884d8"/>
                        {(graphData && graphData[0]) &&
                            Object.keys(graphData[0]).map((key, index) => (
                            (key !== 'name' &&
                                (<Line name={nameMapper[key]['name']} key={key} type="basis" strokeWidth={5} dataKey={key}
                                stroke={nameMapper[key]['color']}/>)
                            )
                        ))}
                    </LineChart>
                </ResponsiveContainer>
        } else if (data.dataPCAnalysis &&
            stateData.value.includes(ANALYTICS_TAB['PC']['key']) && stateData.pcMetrics['vector']) {
            let dataAnalysis = data.dataPCAnalysis,
            analyticsData = getFormatedGraphData(dataAnalysis, stateData.pcMetrics),
            graphData = analyticsData.graphData,
            nameMapper = analyticsData.nameMapper;
            tabData = <ResponsiveContainer width='100%' height={400}>
                <ComposedChart className={classes.lineChart} data={graphData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" minTickGap={20}
                        label={{ value: 'Time of day', position: 'insideBottomRight', offset: 0}}/>
                    <YAxis label={{ value: 'Count per minute', angle: -90, position: 'insideLeft'}}/>
                    <Tooltip />
                    <Legend />
                    <Brush dataKey='name' height={30} stroke="#8884d8"/>
                    {(graphData && graphData[0]) &&
                        Object.keys(graphData[0]).map((key, index) => (
                        (key !== 'name' &&
                            (<Bar name={nameMapper[key]['name']} key={key} dataKey={key} fill={nameMapper[key]['color']} />)
                        )
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
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
                <DataProcessingComponent stateData={stateData}/>
                <div className={classes.seperator}></div>
                {tabData}
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);