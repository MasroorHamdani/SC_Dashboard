import React, {Component} from 'react';

import {withStyles, Typography, Paper,
    AppBar, Tabs, Tab, Avatar, Chip} from '@material-ui/core';

import toiletpaper from '../../images/toilet-paper.png';
import peopleCounter from '../../images/people-counter.png';
import airQuality from '../../images/air-quality.png';
import wetnessDetection from '../../images/wetness-detection.png';
import gatewayDevice from '../../images/wetness-detection.jpg';

import {SORTING, DATE_TIME_FORMAT, DESCRIPTIVE_DATE_TIME_FORMAT} from '../../constants/Constant';
import {formatDateTime} from '../../utils/DateFormat';
import {capitalizeFirstLetter} from '../../utils/FormatStrings';
import EnhancedTable from '../grid/Grid';
import styles from './HealthCheckStyle';

class HealthStatusComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            order: SORTING['DECENDING'],
            orderBy: 'name',
            selected: [],
            page: 0,
            rowsPerPage: 5
        };
        this.info = false;
    }

    handleChange = (name, value) => {
    /**
     * Generic function to set the state in case of any change in any of the fields
     */
        this.setState({
            [name] : value
        });
    }

    handleTabChange = (event, value) => {
    /**
     * On changing the tab selection, this function will be called
     * to get selected tabs data.
     */
        const {classes} = this.props;
        let data = this.formattedData[value];
        let newRow = [];
        data.map((row) => {
            row.info['ID'] = row.ID;
            row.info.deviceStatus = <Chip label={capitalizeFirstLetter(row.info.status)} className={`${classes[`${row.info.status}Status`]}`}/>
            row.info.lastPing = formatDateTime(row.info.last_ping, DATE_TIME_FORMAT, DESCRIPTIVE_DATE_TIME_FORMAT);
            newRow.push(row.info);
        })
        this.setState({value,
        data: newRow});
    };

    render() {
        const {classes, stateData} = this.props;
        this.formattedData = stateData.formattedData;
        const rows = [{ id: 'name', numeric: 'left', disablePadding: false, label: 'Sensor Device'},
        { id: 'deviceStatus', numeric: 'left', disablePadding: false, label: 'Device Status'},
        { id: 'lastPing', numeric: 'left', disablePadding: false, label: 'Last Ping time'}]
        return(
            <div className={classes.root}>
                <main className={classes.content}>
                    {(stateData.name && stateData.formattedData) ?
                        <Paper style={{ padding: 8 * 3 }}>
                            <div>
                                <Typography variant="h6">{stateData.name}</Typography>
                                <Typography variant="h6" gutterBottom>{stateData.locn}</Typography>
                            </div>
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={this.state.value}
                                    onChange={this.handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered={true}
                                    // variant="fullWidth"
                                    >
                                    {Object.keys(this.formattedData).map((key) => {
                                        if(this.formattedData && !this.info) {
                                            this.info = true;
                                            this.setState({value: key}, function() {
                                                this.handleTabChange('', key)
                                            })
                                        }
                                        let image = '';
                                        if (key === 'PC') {
                                            image = peopleCounter;
                                        } else if(key === 'AQ') {
                                            image = airQuality;
                                        } else if(key === 'PT') {
                                            image = toiletpaper;
                                        } else if(key === 'WD') {
                                            image = wetnessDetection;
                                        } else if(key === 'GW') {
                                            image = gatewayDevice;
                                        }
                                        return <Tab key={key} label={<Avatar alt={key} src={image} className={classes.bigAvatar}/>} 
                                            value={key}/>
                                    })}
                                </Tabs>
                            </AppBar>
                            {this.state.data && 
                                <Typography component="div">
                                <EnhancedTable data={this.state.data} rows={rows}
                                    order={this.state.order} orderBy={this.state.orderBy}
                                    rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                                    selected={this.state.selected} category='health'
                                    handleChange={this.handleChange}
                                    // handleClick={handleClick}
                                    redirectID="ID"
                                    allowDelete={false} allowEdit={false}/>
                                </Typography>
                            }
                        </Paper>
                    :
                        <div><Typography variant="h6">{stateData.name}</Typography></div>
                    }
                </main>
                
            </div>
        )
    }
}

export default withStyles(styles)(HealthStatusComponent);