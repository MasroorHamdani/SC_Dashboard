import React, {Component} from 'react';
import {Typography} from '@material-ui/core';
import {Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Brush, ComposedChart,
    Bar, PieChart, Pie, Cell} from 'recharts';
import {METRIC_TYPE, DATA_VIEW_TYPE} from '../../constants/Constant';
import DataProcessingComponent from './DataProcessComponent';

class GraphPlot extends Component {
    render() {
        const {classes, metrics, graphData, nameMapper,
            stateData, handleSamplingChange} = this.props;
        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x  = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy  + radius * Math.sin(-midAngle * RADIAN);
            
            return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
        };
        return(
            metrics.map((metric, index) => {
                return <div key={index}>
                <div className={classes.seperator}></div>
                    <DataProcessingComponent stateData={stateData}
                        handleSamplingChange={handleSamplingChange}
                        metrics={metric}/>
                    
                    <Typography gutterBottom variant="h5">
                        {metric.metricName} - {metric.metricType}
                    </Typography>
                        {(metric.metricType === METRIC_TYPE['TIMESERIES'] && metric.metricDataKey) &&
                            <ResponsiveContainer width='100%' height={400}>
                                <ComposedChart className={classes.lineChart} data={graphData[metric.metricID]}
                                    margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <XAxis dataKey="name" 
                                        minTickGap={20}
                                        label={{ value: 'Time of day', position: 'insideBottomRight', offset: 0}}
                                        />
                                    <YAxis 
                                    label={{ value: 'Concentration (ppm)', angle: -90, position: 'insideLeft'}}
                                    />
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Legend />
                                    <Brush dataKey='name' height={30} stroke="#8884d8"/>
                                    {nameMapper &&
                                        Object.keys(nameMapper[metric.metricID]).map(key => {
                                            let mapper = nameMapper[metric.metricID][key];
                                            if(mapper['chartType'] === DATA_VIEW_TYPE['LINE']) {
                                                return(<Line name={mapper['name']} key={key} type="basis"
                                                    strokeWidth={5} dataKey={key}
                                                    stroke={mapper['color']}/>)
                                            }
                                            if (mapper['chartType'] === DATA_VIEW_TYPE['BAR']) {
                                                return <Bar name={mapper['name']} key={key} dataKey={key}
                                                    fill={mapper['color']} />
                                            }
                                            if (mapper['chartType'] === DATA_VIEW_TYPE['SCATTER']) {
                                                return <Line name={mapper['name']}
                                                    key={key}
                                                    dataKey={key}
                                                    dot={{stroke: mapper['color']}}
                                                    stroke="none"/>
                                            }
                                        })
                                    }
                                </ComposedChart>
                            </ResponsiveContainer>
                        }
                        {(metric.metricType === METRIC_TYPE['CATEGORICAL']) &&
                            <ResponsiveContainer width='100%' height={320}>
                                {metric.dimensions[0].ctype === DATA_VIEW_TYPE['PIE'] ?
                                    <PieChart width="50%" height={320}>
                                        <Pie
                                            isAnimationActive={true}
                                            data={graphData[metric.metricID]} 
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80} 
                                            fill="#8884d8"
                                            >
                                            {
                                                graphData[metric.metricID].map((entry, index) =>
                                                    <Cell fill={entry.color} key={index}/>
                                                )
                                            }
                                        </Pie>
                                        <Tooltip/>
                                        <Legend/>
                                    </PieChart>
                                :
                                    (metric.dimensions[0].ctype === DATA_VIEW_TYPE['TILE'] ?
                                        <div>
                                            {console.log(graphData[metric.metricID][0], metric.dimensions[0])}
                                                    {graphData[metric.metricID][0].name}
                                                    {graphData[metric.metricID][0].value}
                                            </div>
                                    :
                                        <div>Firgure out other options</div>
                                    )
                                }
                            </ResponsiveContainer>
                        // :
                        //     <div>verify</div>    
                        }
                </div>
            })
        )
    }
}
export default GraphPlot;