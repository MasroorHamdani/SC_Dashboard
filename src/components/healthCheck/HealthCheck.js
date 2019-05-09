import React, {Component} from 'react';
import {withStyles, Typography, Avatar, Divider,
    LinearProgress} from '@material-ui/core';

import EnhancedTable from '../grid/Grid';
import {SORTING, DEVICE_TOOL_TIP} from '../../constants/Constant';

import toiletpaper from '../../images/toilet-paper.png';
import peopleCounter from '../../images/people-counter.png';
import airQuality from '../../images/air-quality.png';
import wetnessDetection from '../../images/wetness-detection.png';
import gatewayDevice from '../../images/wetness-detection.jpg';

import styles from './HealthCheckStyle';

class HealthCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: SORTING['DECENDING'],
            orderBy: 'name',
            selected: [],
            page: 0,
            rowsPerPage: 5
        }
    }

    handleChange = (name, value) => {
    /**
     * Generic function to set the state in case of any change in any of the fields
     */
        this.setState({
            [name] : value
        });
    }

    tableData = (classes) => {
    /**
     * This function will format the passed data into table format.
     * It will create small elements, which will be passed to enhanced table
     * to be displayed
     */
        const {healthData} = this.props.stateData;
        let data = [], headerRow = [];
        if(healthData) {
            headerRow.push({ id: 'name', numeric: 'left', disablePadding: false, label: 'Installation' })
            Object.keys(healthData).map((key) => {
                let rowData = {};
                // TODO: List of type devices will come from API latter on, for now it is hard coded!
                Object.keys(healthData[key]).map((innerKey) => {
                    let image = '';
                    if (innerKey === 'PC' || innerKey === 'PPLCTR') {
                        image = peopleCounter;
                    } else if(innerKey === 'AQ' || innerKey === 'ODRDTR') {
                        image = airQuality;
                    } else if(innerKey === 'PT' || innerKey === 'TR') {
                        image = toiletpaper;
                    } else if(innerKey === 'WD') {
                        image = wetnessDetection;
                    } else if(innerKey === 'GW') {
                        image = gatewayDevice;
                    }
                    if (innerKey !== 'undefined') {
                        headerRow.push({ id: innerKey, numeric: 'left', disablePadding: false,
                            toolTip: DEVICE_TOOL_TIP[innerKey],
                            label: <Avatar alt={innerKey} src={image} className={classes.bigAvatar}/> })
                        healthData[key][innerKey].map((row) => {
                            if(row.info) {
                                rowData['ID'] = key;
                                rowData['name'] = <div><Typography>{row.info.name}</Typography><Typography>{row.info.locn}</Typography></div>;
                            } else if(row.status){
                                rowData[innerKey] = <div className={classes.statusBar}>
                                    {Object.keys(row.status).map((key, index) => {
                                        return<Divider key={index} width={`${row.status[key]}px`}
                                            className={classes[key]}/>
                                    })}
                                </div>
                            }
                        })
                    }
                })
                if(rowData && rowData['ID'])
                    data.push(rowData)
            })
            headerRow = [...new Map(headerRow.map(o => [o.id, o])).values()];
            return({'data': data, 'rows': headerRow});
        }
    }

    render() {
        const {classes, stateData, handleClick} = this.props;
        let passedData = this.tableData(classes);
        return (
            <div className={classes.root}>
                {stateData.loading &&
                    <LinearProgress className={classes.buttonProgress}/>
                }
                <main className={classes.content}>
                    {(stateData && stateData.healthData) &&
                        <div>
                            <EnhancedTable rows={passedData.rows} data={passedData.data}
                            order={this.state.order} orderBy={this.state.orderBy}
                            rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                            selected={this.state.selected} category='health'
                            handleChange={this.handleChange}
                            handleClick={handleClick}
                            redirectID="ID"
                            />
                        </div>
                    }
                    {(!stateData.loading && !stateData.healthData) &&
                        <div><Typography variant="h6">No Health Status Data to display</Typography></div>
                    }
                </main>
            
            </div>
        )
    }
}

export default withStyles(styles)(HealthCheck);
