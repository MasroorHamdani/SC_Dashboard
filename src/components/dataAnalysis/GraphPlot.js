import React, {Component} from 'react';
import {withStyles, Typography} from '@material-ui/core';
import {Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Brush, ComposedChart, Bar} from 'recharts';
    
class GraphPlot extends Component {
    render() {
        const {classes, metrics, graphData, nameMapper} = this.props;
        return(
            <div>
            <Typography gutterBottom variant="h5">
                {metrics.name} - {metrics.metricType}
            </Typography>
            <ResponsiveContainer width='100%' height={400}>
                {metrics.metricType=== 'timeseries' &&
                    <ComposedChart className={classes.lineChart} data={graphData}
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
                            Object.keys(graphData[0]).map(key =>
                            {
                                if(key !== 'name') {
                                    if(nameMapper[key]['chartType'] === 'line') {
                                        return <Line name={nameMapper[key]['name']} key={key} type="basis" strokeWidth={5} dataKey={key}
                                            stroke={nameMapper[key]['color']}/>
                                    }
                                    // )
                                    if (nameMapper[key]['chartType'] === 'bar') {
                                        return(<Bar name={nameMapper[key]['name']} key={key} dataKey={key} fill={nameMapper[key]['color']} />)
                                    }
                                }
                            })
                        }
                    </ComposedChart>
                }
            </ResponsiveContainer>
        </div>
        )
    }
}
export default GraphPlot;