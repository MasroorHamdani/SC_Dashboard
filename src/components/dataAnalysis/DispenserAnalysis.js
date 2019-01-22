import React, { Component } from 'react';
import {withStyles, FormControl, InputLabel,
    NativeSelect, Input, FormHelperText, Typography} from '@material-ui/core';
import {Line, XAxis, YAxis, CartesianGrid, Tooltip,
        Legend, ResponsiveContainer, Brush,
        ComposedChart, Bar, Cell} from 'recharts';
// import * as firebase from 'firebase';
import styles from './DataAnalysisStyle';
import GraphPlot from './GraphPlot';
import moment from 'moment';
import {DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT} from '../../constants/Constant';

class DispenserAnalysis extends Component {
    constructor() {
        super()
        this.state = {
            dispenser: []
        };
        // this.ref = firebase.firestore().collection('JTC_TIM_F1').doc('JTC_LOCN2:DM').collection('DATA');
    }
    onCollectionUpdate = (querySnapshot) => {
        const dispenser = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
        });
    }
    componentDidMount() {
        // this.ref.onSnapshot(this.onCollectionUpdate);
    }
    handleBarClick = (key) => {
        console.log("Clicked", key);
    }
    generateDispenserData(dataPassed, classes) {
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
            // tabData = <GraphPlot graphData={graphData}
            //     nameMapper={nameMapper} metrics={dataMetrics}
            //     classes={classes}/>
            tabData = <div>
            <Typography gutterBottom variant="h5">
                {dataMetrics.name} - {dataMetrics.metricType}
            </Typography>
            <ResponsiveContainer width='100%' height={600}>
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
                                    return <Bar name={nameMapper[key]['name']} barSize={50} key={key}
                                        dataKey={key} >
                                    {
                                        graphData.map((entry, index) => {
                                        let color;
                                        if(entry[key] >= 80)
                                            color = '#16a085';
                                        else if(entry[key] <= 40)
                                            color = '#ea2d1f';
                                        else if(entry[key] < 80 && entry[key] > 40)
                                            color = '#c3b025';
                                        return <Cell key={index} fill={color} onClick={e => this.handleBarClick(entry[key])}/>;
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
    
    render() {
        const {classes, data, stateData,
            handleLocationSelectionChange} = this.props;
        let tabData;
        if(stateData.dispenserData) {
            tabData = this.generateDispenserData(stateData.dispenserData, classes);
        }
        return (
            <div className={classes.rootDispenser}>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="location-native-label-placeholder">
                        Location List
                    </InputLabel>
                    <NativeSelect
                        value={stateData.location}
                        onChange={handleLocationSelectionChange}
                        input={<Input name="location" id="location-native-label-placeholder" />}>
                        <option value='' key='location' id='location'>Choose Location</option>
                        { data &&
                            data.map(function(dt) {
                                return <option value={dt.insid} key={dt.insid}>{dt.insid}</option>
                            })
                        }
                    </NativeSelect>
                    <FormHelperText>Please select Location to get Dispenser data</FormHelperText>
                </FormControl>
                {tabData}
            </div>
        )
    }
}

export default withStyles(styles)(DispenserAnalysis);