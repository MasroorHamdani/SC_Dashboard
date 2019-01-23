import React, { Component } from 'react';
import {withStyles, ExpansionPanel, ExpansionPanelSummary,
    Typography, ExpansionPanelDetails, Chip} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {PieChart, Pie, Legend, Cell, Tooltip} from 'recharts';
import {getFormatedDateTime, formatDateTime} from '../../utils/DateFormat';
import {ALERT_STATUS} from '../../constants/Constant';

import styles from './DataAnalysisStyle';

class AlertAnalysis extends Component {
    render() {
        const {classes, data} = this.props;
        const RADIAN = Math.PI / 180; 
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA8045'];
        const piedata = [{name: 'Resolved', value: 400}, {name: 'Not resolved', value: 300},
                  {name: 'Not Sent', value: 300}, {name: 'Pending', value: 200},
                  {name: 'Blocked', value: 100}];
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x  = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy  + radius * Math.sin(-midAngle * RADIAN);
            
            return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
            );
        };
        return (
            <div className={classes.root}>
            {/* <div> */}
                <PieChart width={400} height={400}>
                    <Pie isAnimationActive={false}
                    dataKey='value'
                    data={piedata}
                    // cx={300}
                    // cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    >
                    {
                        piedata.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                    }
                    </Pie>
                    <Legend/>
                    <Tooltip/>
                </PieChart>
            {/* </div> */}
            {data &&
                    data.map((row, index) => {
                        return (<ExpansionPanel key={index}>
                            {row.header &&
                                <ExpansionPanelSummary className={classes.expansionRoot} expandIcon={<ExpandMoreIcon />}>
                                <div className={classes.heading}>
                                    <Typography variant="h6">{row.header.StatusInfo.Reason}</Typography>
                                    <Typography>
                                        {formatDateTime(row.header.Timestamp,
                                            'YYYYMMDDHHmmss',
                                            'dddd, MMMM Do, YYYY h:mm:ss a')}
                                    </Typography>
                                    </div>
                                    <Chip
                                        label={ALERT_STATUS[row.header.StatusInfo.Status]}
                                        className={classes[row.header.StatusInfo.Status]}
                                    />
                                </ExpansionPanelSummary>
                            }
                            {row.data.map((dt, index) => {
                                return<ExpansionPanelDetails key={index}>
                                    <Typography className={classes.content}>
                                        {getFormatedDateTime(dt.Timestamp, 'hh:mm A')}
                                        {/* {dt.Data.Type} */}
                                    </Typography>
                                    <Typography>{dt.Data.Text}</Typography>
                                </ExpansionPanelDetails>
                            })}
                        </ExpansionPanel>)
                    })
            }
            </div>
        )
    }
}

export default withStyles(styles)(AlertAnalysis);