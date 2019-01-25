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
            tabData = 'hello';
            // console.log(graphData, nameMapper, metrics);
            tabData = <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metrics}
                        classes={classes}/>;
            // tabData =
                // metrics.map((metric, index) => {
                //     return <div key={index}>
                //         <Typography gutterBottom variant="h5">
                //             {metric.metricName} - {metric.metricType}
                //         </Typography>
                //         <ResponsiveContainer width='100%' height={400}>
                //             {metric.metricType === 'timeseries' ?
                //                 <ComposedChart className={classes.lineChart} data={graphData[metric.metricID]}
                //                     margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                //                     <XAxis dataKey="name" 
                //                         minTickGap={20}
                //                         label={{ value: 'Time of day', position: 'insideBottomRight', offset: 0}}
                //                         />
                //                     <YAxis 
                //                     label={{ value: 'Concentration (ppm)', angle: -90, position: 'insideLeft'}}
                //                     />
                //                     <CartesianGrid strokeDasharray="3 3"/>
                //                     <Tooltip/>
                //                     <Legend />
                //                     <Brush dataKey='name' height={30} stroke="#8884d8"/>
                //                     {(graphData && graphData[metric.metricID]) &&
                //                         Object.keys(graphData[metric.metricID][0]).map(key =>
                //                         {
                //                             if(key !== 'name') {
                //                                 if(nameMapper[key]['chartType'] === 'line') {
                //                                     return(<Line name={nameMapper[key]['name']} key={key} type="basis"
                //                                     strokeWidth={5} dataKey={key}
                //                                     stroke={nameMapper[key]['color']}/>)
                //                                 }
                //                                 if (nameMapper[key]['chartType'] === 'bar') {
                //                                         return <Bar name={nameMapper[key]['name']} key={key} dataKey={key}
                //                                         fill={nameMapper[key]['color']} />
                //                                 }
                //                             }
                //                         })
                //                     }
                //                 </ComposedChart>
                //             : <div>validate</div>
                //             }
                //         </ResponsiveContainer>
                //     </div>
                // })
        return tabData;
    }
    render() {
        const {stateData, data, classes, handleSamplingChange,
            getMetric} = this.props;
        let tabData;
        if (data.dataAQAnalysis && data.dataAQAnalysis.data.data.metrics &&
        stateData.value.includes(ANALYTICS_TAB['AQ']['key']) &&  stateData.aqMetrics) {
            tabData = this.generateDataAnalytics(data.dataAQAnalysis.data.data.metrics, stateData.aqMetrics, classes);
        } else if (data.dataPCAnalysis && data.dataPCAnalysis.data.data.metrics &&
            stateData.value.includes(ANALYTICS_TAB['PC']['key']) && stateData.pcMetrics){//stateData.pcMetrics['vector']) {
            // console.log(stateData.pcMetrics, "stateData.pcMetrics");
            tabData = this.generateDataAnalytics(data.dataPCAnalysis.data.data.metrics,
                // stateData.pcMetrics,
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