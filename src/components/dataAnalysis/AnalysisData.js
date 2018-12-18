import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Brush, ComposedChart, Bar} from 'recharts';
import styles from './AnalysisDataStyle';
import moment from 'moment';
import {DATE_TIME_FORMAT, ANALYTICS_TAB} from '../../constants/Constant';
import DateRowComponent from './DateRowComponent';
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
    
    handleDatePicker = (date) => {
        this.setState({
            selectedIndex: -1
        }, function () {
        this.props.handleDateChange('custom',
            this.state.startDate, this.state.endDate)
        })
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

    render() {
        const {stateData, data, classes} = this.props;
        let tabData;

        if (data.DataAQAnalysisReducer &&
            stateData.value.includes(ANALYTICS_TAB['AQ']['key']) && stateData.aqMetrics['vector']) {
            const dataAnalysis = data.DataAQAnalysisReducer.data;
            let graphData = [],
            flattedData = _.flatMap(dataAnalysis, ({ DEVICE_ID, data }) =>
                _.map(data, dt => ({ DEVICE_ID, ...dt }))
                );
            flattedData.map(function(d) {
                let graphElement = {}
                graphElement['name'] = moment(d.t, DATE_TIME_FORMAT).format('DD/MM/YYYY HH:mm');
                // stateData.aqMetrics['vector'].map((vec) => {
                //     graphElement[vec.shortName] = vec;
                // })
                
                graphElement['alc'] = d.v.alc;
                graphElement['amm'] = d.v.amm;
                graphElement['no2'] = d.v.no2;
                graphData.push(graphElement)
            });
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
                        {/* {Object.keys(graphData).map((key, index) => (
                            <div>{key}</div>
                            // <Line name={graphData[key]['name']} type="basis" strokeWidth={5} dataKey={key} stroke="#008000" />
                        ))} */}
                        <Line name="VOCs" type="basis" strokeWidth={5} dataKey="alc" stroke="#008000" />
                        <Line name="Ammonia" type="basis" strokeWidth={4} dataKey="amm" stroke="#607d8c" />
                        <Line name="Nitrogen Dioxide" type="basis" strokeWidth={4} dataKey="no2" stroke="#808080" />
                    </LineChart>
                </ResponsiveContainer>
        } else if (data.DataPCAnalysisReducer &&
            stateData.value.includes(ANALYTICS_TAB['PC']['key']) && stateData.pcMetrics['vector']) {
            const dataAnalysis = data.DataPCAnalysisReducer.data;
            let path = stateData.pcMetrics['vector'][0]['path'],
            name = stateData.pcMetrics['vector'][0]['Name'],
            series = stateData.pcMetrics['MetricType'];
            let graphData = [],
            flattedData = _.flatMap(dataAnalysis, ({ DEVICE_ID, data }) =>
                _.map(data, dt => ({ DEVICE_ID, ...dt }))
                );
            flattedData.map(function(d) {
                let graphElement = {}
                graphElement['name'] = moment(d.t, DATE_TIME_FORMAT).format('DD/MM/YYYY HH:mm');
                graphElement['v'] = d[path]
                graphData.push(graphElement)
            });
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
                    <Bar name={name} dataKey="v" fill="#8884d8" />
                </ComposedChart>
            </ResponsiveContainer>
        }

        const timeList = [
            {
                name: "last1Hour",
                key: "last1Hour",
                value: 0,
                text: "1h"
            },
            {
                name: "last3Hour",
                key: "last3Hour",
                value: 1,
                text: "3h"
            },
            {
                name: "last12Hour",
                key: "last12Hour",
                value: 2,
                text: "12h"
            },
            {
                name: "last1Day",
                key: "last1Day",
                value: 3,
                text: "1d"
            },
            {
                name: "last3Day",
                key: "last3Day",
                value: 4,
                text: "3d"
            },
            {
                name: "last1Week",
                key: "last1Week",
                value: 5,
                text: "1w"
            },
        ]
        return (
            <div className={classes.graph}>
                <DateRowComponent handleDatePicker={this.handleDatePicker}
                    handleChangeStart={this.handleChangeStart}
                    handleChangeEnd={this.handleChangeEnd}
                    handleListSelection={this.handleListSelection}
                    data={this.state}
                    timeList={timeList}
                    />
                <div className={classes.seperator}></div>
                {tabData}
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);