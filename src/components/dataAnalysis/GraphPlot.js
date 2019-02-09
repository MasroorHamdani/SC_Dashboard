import React, {Component} from 'react';
import {Typography} from '@material-ui/core';
import {Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Brush, ComposedChart,
    Bar, PieChart, Pie, Cell, Sector, Area} from 'recharts';
import {METRIC_TYPE, DATA_VIEW_TYPE} from '../../constants/Constant';
import DataProcessingComponent from './DataProcessComponent';

class GraphPlot extends Component {
    state = ({
        activeIndex: 0
    });
    getInitialState = () =>{
        return {
          activeIndex: 0,
        };
    }
    
    onPieEnter = (data, index) => {
    this.setState({
        activeIndex: index,
    });
    }
    render() {
        const {classes, metrics, graphData, nameMapper,
            stateData, handleSamplingChange} = this.props;
        const renderActiveShape = (props) => {
            const RADIAN = Math.PI / 180;
            const { cx, cy, midAngle, innerRadius, outerRadius, startAngle,
            endAngle, fill, payload, percent, value } = props;
            const sin = Math.sin(-RADIAN * midAngle);
            const cos = Math.cos(-RADIAN * midAngle);
            const sx = cx + (outerRadius + 10) * cos;
            const sy = cy + (outerRadius + 10) * sin;
            const mx = cx + (outerRadius + 30) * cos;
            const my = cy + (outerRadius + 30) * sin;
            const ex = mx + (cos >= 0 ? 1 : -1) * 22;
            const ey = my;
            const textAnchor = cos >= 0 ? 'start' : 'end';
        
            return (
                <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{value}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
                </g>
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
                                    {metric.dimensions[0].type === 'derivedDim' ?
                                        <YAxis type="category" width={120}
                                        />
                                    :
                                        <YAxis
                                        // label={{ value: 'Concentration (ppm)', angle: -90, position: 'insideLeft'}}
                                        />
                                    }
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Legend />
                                    <Brush dataKey='name' height={30} stroke="#8884d8"/>
                                    {nameMapper &&
                                        Object.keys(nameMapper[metric.metricID]).map(key => {
                                            let mapper = nameMapper[metric.metricID][key];
                                            if(mapper['chartType'] === DATA_VIEW_TYPE['LINE']) {
                                                return(<Line name={mapper['name']} key={key} type="monotone"
                                                    strokeWidth={5}
                                                    dataKey={key}
                                                    dot={false}
                                                    // dot={{stroke: mapper['color']}}
                                                    // fill={mapper['color']}
                                                    stroke={mapper['color']}
                                                     // stroke="none"
                                                    />)
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
                                                    fill={mapper['color']}
                                                    stroke="none"/>
                                            }
                                            if (mapper['chartType'] === DATA_VIEW_TYPE['AREA']) {
                                                return <Area type='monotone'
                                                    name={mapper['name']}
                                                    key={key}
                                                    dataKey={key}
                                                    fill={mapper['color']}
                                                    stroke={mapper['color']}/>
                                            }
                                        })
                                    }
                                </ComposedChart>
                            </ResponsiveContainer>
                        }
                        {(metric.metricType === METRIC_TYPE['CATEGORICAL']) &&
                            <ResponsiveContainer>
                                {metric.dimensions[0].ctype === DATA_VIEW_TYPE['PIE'] ?
                                    <PieChart height={320}>
                                        <Pie
                                            activeIndex={this.state.activeIndex}
                                            activeShape={renderActiveShape}
                                            isAnimationActive={true}
                                            data={graphData[metric.metricID]} 
                                            labelLine={false}
                                            outerRadius={120} 
                                            fill="#8884d8"
                                            innerRadius={100}
                                            onMouseEnter={this.onPieEnter}
                                            >
                                            {
                                                graphData[metric.metricID].map((entry, index) =>
                                                    <Cell fill={entry.color} key={index}/>
                                                )
                                            }
                                        </Pie>
                                        <Legend/>
                                    </PieChart>
                                :
                                    (metric.dimensions[0].ctype === DATA_VIEW_TYPE['TILE'] ?
                                        <div className={classes.tile}
                                            style={{backgroundColor:graphData[metric.metricID][0].color}}>
                                            <Typography gutterBottom variant="h6">
                                                {graphData[metric.metricID][0].name}
                                            </Typography>
                                            <Typography gutterBottom variant="h6">
                                                {graphData[metric.metricID][0].value}
                                            </Typography>
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