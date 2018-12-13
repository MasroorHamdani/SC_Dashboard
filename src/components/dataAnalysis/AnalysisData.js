import React, { Component } from 'react';
import {withStyles, List, ListItem, ListItemText} from '@material-ui/core';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend} from 'recharts';
import {ExpandMore} from '@material-ui/icons';
import {DateFormatInput, TimeFormatInput} from 'material-ui-next-pickers'
import styles from './AnalysisDataStyle';
import moment from 'moment';
import {DATE_TIME_FORMAT} from '../../constants/Constant';
/**
 * Component to display Analytics details for a select Device to User
 * It will show graphical data to users.
 */
class AnalysisData extends Component {
    constructor(props) {
        super(props)
        this.state =({
            date: Date,
            time: Date,
            selectedIndex: true
        })
    }
    
    handleDatePicker = () => {
        
    }
    // onChangeDate = (date:Date) => {
    //     console.log('Date: ', date)
    //     this.setState({date})
    //   } 
    // onChangeTime = (time:Date) => {
    //     console.log('Time: ', time)
    //     this.setState({time})
    // } 
    handleListSelection = (event, text, value) => {
        this.setState({
            selectedIndex: value
        }, function () {
            this.props.handleDateChange(event, text)
        })
    }

    render() {
        const {stateData, data, classes, handleDateChange} = this.props;
        let graphData = []
        data[0].data.map(function(d) {
            let graphElement = {}
            graphElement['name'] = moment(d.t, DATE_TIME_FORMAT).format('hh:mm A');
            graphElement['alc'] = d.v.alc;
            graphElement['amm'] = d.v.amm;
            graphElement['cmo'] = d.v.cmo;
            graphElement['no2'] = d.v.no2;
            graphData.push(graphElement)
        })
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
            <List dense={true} className={classes.timeList}>
                {timeList.map(function(timeLine) {
                    return <ListItem key={timeLine.key} name={timeLine.name} value={timeLine.value}
                    // selected={this.state.selectedIndex === timeLine.value}
                    onClick={e => handleDateChange(e, timeLine.text, timeLine.value)}>
                    {/* onClick={this.handleListSelection}> */}
                        <ListItemText primary={timeLine.text}/>
                    </ListItem>
                })}
               <ListItem value={6} name="custom" key="custom" onClick={this.handleDatePicker}>
                    <ListItemText primary="Custom"/><ExpandMore />
                    {/* <DateFormatInput name='date-input' value={this.state.date} onChange={this.onChangeDate}/>
                    <TimeFormatInput name='time-input' value={this.state.time} onChange={this.onChangeTime}/> */}
                </ListItem>
            </List>
            <div className={classes.seperator}></div>
            <LineChart className={classes.lineChart} width={700} height={400} data={graphData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="name"
                    label={{ value: 'Time of day', position: 'insideBottomRight', offset: 0}}/>
                <YAxis label={{ value: 'Concentration (ppm)', angle: -90, position: 'insideLeft'}}
                />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />
                <Line type="monotone" strokeWidth={4} dataKey="alc" stroke="#008000" />
                <Line type="monotone" strokeWidth={4} dataKey="amm" stroke="#607d8c" />
                <Line type="monotone" strokeWidth={4} dataKey="cmo" stroke="#ffc8d1" />
                <Line type="monotone" strokeWidth={4} dataKey="no2" stroke="#808080" />
            </LineChart>
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);