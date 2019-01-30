import React, {Component} from 'react';
import {withStyles, Typography} from '@material-ui/core';
import {Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Brush, ComposedChart,
    Bar, PieChart, Pie, Cell} from 'recharts';
import {METRIC_TYPE, DATA_VIEW_TYPE} from '../../constants/Constant';
import DataProcessingComponent from './DataProcessComponent';

class GraphPlot extends Component {
    render() {
        const {classes, metrics, graphData, nameMapper,
            stateData, handleSamplingChange, getMetric} = this.props;
        const RADIAN = Math.PI / 180;
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];                 
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
        // console.log(stateData);
        return(
        metrics.map((metric, index) => {
            return <div key={index}>
                <DataProcessingComponent stateData={stateData}
                    handleSamplingChange={handleSamplingChange}
                    metrics={metric}
                    getMetric={getMetric}/>
                <div className={classes.seperator}></div>
                <Typography gutterBottom variant="h5">
                    {metric.metricName} - {metric.metricType}
                </Typography>
                
                    {(metric.metricType === METRIC_TYPE['TIMESERIES'] && metric.metricDataKey) ?
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
                                {/* {(graphData && graphData[metric.metricID]) &&
                                    // console.log(graphData[metric.metricID][0])
                                    Object.keys(graphData[metric.metricID][8]).map(key =>
                                    {
                                        console.log(key, nameMapper[metric.metricID])
                                        if(key !== 'name') {
                                            let mapper = nameMapper[metric.metricID][key];
                                            // console.log(mapper);
                                            if(mapper && mapper['chartType'] === DATA_VIEW_TYPE['LINE']) {
                                                return(<Line name={mapper['name']} key={key} type="basis"
                                                strokeWidth={5} dataKey={key}
                                                stroke={mapper['color']}/>)
                                            }
                                            if (mapper && mapper['chartType'] === DATA_VIEW_TYPE['BAR']) {
                                                    return <Bar name={mapper['name']} key={key} dataKey={key}
                                                    fill={mapper['color']} />
                                            }
                                            if (mapper && mapper['chartType'] === DATA_VIEW_TYPE['SCATTER']) {
                                                return <Line name={mapper['name']} key={key}
                                                dataKey={key}
                                                dot={{stroke: mapper['color']}}
                                                stroke="none"
                                                />
                                            }
                                        }
                                    })
                                } */}
                            </ComposedChart>
                        </ResponsiveContainer>
                    : 
                    <PieChart width={800} height={400}>
                        <Pie
                            isAnimationActive={true}
                            data={graphData[metric.metricID]} 
                            cx={300} 
                            cy={200} 
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80} 
                            fill="#8884d8"
                            >
                            {
                                graphData[metric.metricID].map((entry) =>
                                    <Cell fill={entry.color}/>
                                )
                            }
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                    }
                
            </div>
        })
        )
    }
}
export default GraphPlot;