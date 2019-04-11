import React, { Component } from 'react';
import {withStyles, FormControl, InputLabel,
    NativeSelect, Input, FormHelperText, Typography} from '@material-ui/core';
import {XAxis, YAxis, CartesianGrid, Tooltip,
        Legend, ResponsiveContainer,
        ComposedChart, Bar, Cell} from 'recharts';
import styles from './AnalysisDataStyle';
import CustomModal from '../modal/Modal';
import GraphPlot from './GraphPlot';
import DateRowComponent from './DateRowComponent';
import {getFormatedGraphData} from '../../utils/AnalyticsDataFormat';
import {TIME_LIST} from '../../constants/Constant';

class DispenserAnalysis extends Component {
    
    generateDispenserData = (dataPassed, classes) => {
        let dataMetrics= {}, tabData;
            dataMetrics['metricType'] = 'timeseries';
            dataMetrics['name'] = 'Raw Data';
            dataMetrics['vector'] = [];
            dataMetrics['vector'].push({
            name: 'Dispenser Data',
            path: 'v.d',
            unit: 'some thing',
            shortName: 'DD',
            color: '#16a085',
            statistic: 'sum',
            chartType: 'bar'
            });
            let nameMapper = {};
            let graphData = [];
            dataPassed.map((d) => {
                let graphElement = {}
                graphElement['name'] = d['v']['d'];
                dataMetrics['vector'].map((vec) => {
                    graphElement[vec.shortName] = d['v']['d'];
                    nameMapper[vec.shortName] = {};
                    nameMapper[vec.shortName]['name'] = vec.name;
                    nameMapper[vec.shortName]['color'] = vec.color;
                    nameMapper[vec.shortName]['chartType'] = vec.chartType;
                })
                graphData.push(graphElement);
            });
            tabData = <div>
            <Typography gutterBottom variant="h5">
                {dataMetrics.name} - {dataMetrics.metricType}
            </Typography>
            <ResponsiveContainer width='30%' height={400}>
                {dataMetrics.metricType=== 'timeseries' &&
                    <ComposedChart layout="vertical" className={classes.lineChart} data={graphData}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <YAxis dataKey="name" minTickGap={20} type="category"
                            label={{ value: 'Dispenser', angle: -90, position: 'insideLeft'}}/>
                        <XAxis type="number" label={{ value: 'Value', position: 'insideBottomRight', offset: 0}}
                        />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        {(graphData && graphData[0]) &&
                            Object.keys(graphData[0]).map(key =>
                            {
                                if(key !== 'name') {
                                    return <Bar name={nameMapper[key]['name']} barSize={60} key={key}
                                        dataKey={key} >
                                        {
                                            graphData.map((entry, index) => {
                                            let color;
                                            if(entry[key] >= 80)
                                                color = '#1b5e20';
                                            else if(entry[key] <= 40)
                                                color = '#dd2c00';
                                            else if(entry[key] < 80 && entry[key] > 40)
                                                color = '#ffeb3b';
                                            return <Cell key={index} fill={color} onClick={e => this.props.handleBarClick(entry[key])}/>;
                                            })
                                        }
                                    </Bar>
                                }
                            })
                        }
                    </ComposedChart>
                }
            </ResponsiveContainer>
        </div>

        return tabData;
    }

    generateDispenserDataAnalytics = (data, metrics, classes, handleChangeStart,
        handleChangeEnd, stateData, handleListSelection, handleDatePicker,
        handleSamplingChange) => {
        let dataAnalysis = data,
            analyticsData = getFormatedGraphData(dataAnalysis, metrics),
            graphData = analyticsData.graphData,
            nameMapper = analyticsData.nameMapper,
            tabData = <div className={classes.dispenserGraph}>
                        <DateRowComponent handleDatePicker={handleDatePicker}
                            handleChangeStart={handleChangeStart}
                            handleChangeEnd={handleChangeEnd}
                            handleListSelection={handleListSelection}
                            data={stateData}
                            timeList={TIME_LIST}/>
                        <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metrics}
                        stateData={stateData}
                        handleSamplingChange={handleSamplingChange}/>
                    </div>;
        return tabData;
    }

    render() {
        const {classes, stateData,
            handleLocationSelectionChange, handleClose,
            handleChangeStart, handleChangeEnd, handleDatePicker,
            handleListSelection, handleSamplingChange} = this.props;
        let tabData, deviceData;
        if(stateData.dispenserData) {
            tabData = this.generateDispenserData(stateData.dispenserData, classes);
        }
        if(stateData.dispenserDetails) {
            deviceData = this.generateDispenserDataAnalytics(stateData.dispenserDetails.data.metrics,
                stateData.dispenserDetails.data.allMetrics,
                classes, handleChangeStart, handleChangeEnd, stateData,
                handleDatePicker, handleListSelection, handleSamplingChange);
        }
        return (
            <div className={classes.root}>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="location-native-label-placeholder">
                        Location List
                    </InputLabel>
                    <NativeSelect
                        value={stateData.location}
                        onChange={handleLocationSelectionChange}
                        input={<Input name="location" id="location-native-label-placeholder" />}>
                        <option value='' key='location' id='location'>Choose Location</option>
                        { stateData.deviceList &&
                            stateData.deviceList.map(function(dt) {
                                return <option value={dt.insid} key={dt.Devid}>{dt.Display}</option>
                            })
                        }
                    </NativeSelect>
                    <FormHelperText>Please select Location to get Dispenser data</FormHelperText>
                </FormControl>
                {tabData}
                <CustomModal
                    header="Dispenser Details"
                    content={deviceData}
                    handleClose={handleClose}
                    open={stateData.open}
                    />
            </div>
        )
    }
}

export default withStyles(styles)(DispenserAnalysis);