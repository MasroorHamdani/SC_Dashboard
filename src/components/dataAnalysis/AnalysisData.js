import React, { Component } from 'react';
import {withStyles, Typography, InputLabel, Select, MenuItem} from '@material-ui/core';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend} from 'recharts';
import styles from './AnalysisDataStyle';
import moment from 'moment';
/**
 * Component to display Analytics details for a select Device to User
 * It will show graphical data to users.
 */
class AnalysisData extends Component {
    render() {
        const {category, data, classes} = this.props;
        let graphData = []
        data[0].data.map(function(d) {
            let graphElement = {}
            graphElement['name'] = moment(d.t, 'YYYYMMDDHHmm').format('hh:mm A');
            graphElement['alc'] = d.v.alc;
            graphElement['amm'] = d.v.amm;
            graphElement['cmo'] = d.v.cmo;
            graphElement['no2'] = d.v.no2;
            graphData.push(graphElement)
        })
        return (
            <div className={classes.graph}>
            <Typography component="div" className={classes.timeDropper}>
                <InputLabel htmlFor="timeRange">Time Range</InputLabel>
                <Select className={classes.select}

                    // value={this.state.timeRange}
                    // onChange={this.handleSelectionChange}
                    // inputProps={{
                    //     name: 'timeRange',
                    //     id: 'timeRange',
                    // }}
                >
                <MenuItem value="lastHour" key="lastHour">Last Hour</MenuItem>
                <MenuItem value="last3Hour" key="last3Hour">Last 3 Hour</MenuItem>
                <MenuItem value="last6Hour" key="last6Hour">Last 6 Hour</MenuItem>
                <MenuItem value="last12Hour" key="last12Hour">Last 12 Hour</MenuItem>
                <MenuItem value="last24Hour" key="last24Hour">Last 24 Hour</MenuItem>
                <MenuItem value="last3Days" key="last3Daysr">Last 3 Days</MenuItem>
                <MenuItem value="last1Week" key="last1Week">Last 1 Week</MenuItem>
                <MenuItem value="last1Monthr" key="last1Month">Last 1 Month</MenuItem>
                </Select>
            </Typography>
            <div className={classes.seperator}></div>
            <LineChart className={classes.lineChart} width={700} height={400} data={graphData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="name"
                    label={{ value: 'Time of day', position: 'insideBottomRight', offset: 0}}/>
                    {/* <Label value="Time of day" offset={0} position="bottom" /> */}
                {/* </XAxis> */}
                <YAxis label={{ value: 'Concentration (ppm)', angle: -90, position: 'insideLeft'}}
                />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />{/*verticalAlign="top" height={36}/>*/}
                <Line type="monotone" dataKey="alc" stroke="#008000" />
                <Line type="monotone" dataKey="amm" stroke="#607d8c" />
                <Line type="monotone" dataKey="cmo" stroke="#ffc8d1" />
                <Line type="monotone" dataKey="no2" stroke="#808080" />
            </LineChart>
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);