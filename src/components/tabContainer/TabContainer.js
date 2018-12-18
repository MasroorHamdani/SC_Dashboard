import React, { Component } from 'react';
import {Typography } from '@material-ui/core';
import {PROJECT_TABS, SORTING} from '../../constants/Constant';
import EnhancedTable from '../grid/Grid';

class TabContainer extends Component {
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
        this.setState({
            [name] : value
        });
    }

    render() {
        const {category, data, handleClick} = this.props;
        let tabData, rows, tabContent;
        if (data.ProjectDetailsReducer && data.ProjectDetailsReducer.data && category === PROJECT_TABS['INSTALLATION']) {
            tabContent = data.ProjectDetailsReducer.data;
            rows = [{ id: 'name', numeric: false, disablePadding: false, label: 'Name' },
                    { id: 'locn', numeric: false, disablePadding: false, label: 'Location' }]
            tabData = <Typography component="div">
            <EnhancedTable data={tabContent} rows={rows}
                order={this.state.order} orderBy={this.state.orderBy}
                rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                selected={this.state.selected} category={category}
                handleChange={this.handleChange} handleClick={handleClick} redirectID="insid"/>
            </Typography>
        } else if(data.ProjectTeamDataReducer && data.ProjectTeamDataReducer.data && category === PROJECT_TABS['TEAM']) {
            tabContent = data.ProjectTeamDataReducer.data[0].userdetails;
            rows = [{ id: 'ID', numeric: false, disablePadding: false, label: 'User Id' },
                    { id: 'Firstname', numeric: false, disablePadding: false, label: 'Firstname' },
                    { id: 'Lastname', numeric: false, disablePadding: false, label: 'Lastname' },
                    { id: 'Phoneno', numeric: false, disablePadding: false, label: 'Phone no' },
                    { id: 'RFID', numeric: false, disablePadding: false, label: 'RFID' },
                    // { id: 'Mute', numeric: false, disablePadding: false, label: 'Status' },
                    { id: 'ShiftEnd', numeric: false, disablePadding: false, label: 'Shift End' },
                    { id: 'ShiftStart', numeric: false, disablePadding: false, label: 'Shift Start' }
                ]
            tabData = <Typography component="div">
            <EnhancedTable data={tabContent} rows={rows}
                order={this.state.order} orderBy={this.state.orderBy}
                rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                selected={this.state.selected} category={category}
                handleChange={this.handleChange} handleClick={handleClick} redirectID="ID"
                editTable={true} deleteTable={true}/>
            </Typography>
        }
        return (
            <div>
            {tabData}
            </div>
        );
    }
}

export default TabContainer;