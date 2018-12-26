import React, { Component } from 'react';
import {Typography } from '@material-ui/core';
import {PROJECT_TABS, SORTING, HOUR_MIN_FORMAT} from '../../constants/Constant';
import EnhancedTable from '../grid/Grid';
import {getFormatedDateTime} from '../../utils/DateFormat';

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
    formatedDateTime = (data) => {
        data.map(function (d) {
            d.ShiftStart = getFormatedDateTime(d.ShiftStart, HOUR_MIN_FORMAT);
            d.ShiftEnd = getFormatedDateTime(d.ShiftEnd, HOUR_MIN_FORMAT);
            return(d)
        })
        return(data)
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
            tabContent = this.formatedDateTime(data.ProjectTeamDataReducer.data[0].userdetails);
            rows = [{ id: 'Firstname', numeric: false, disablePadding: false, label: 'Firstname' },
                    { id: 'ShiftStart', numeric: false, disablePadding: false, label: 'Shift Start', editTable: true },
                    { id: 'ShiftEnd', numeric: false, disablePadding: false, label: 'Shift End', editTable: true}
                ]
            tabData = <Typography component="div">
            <EnhancedTable data={tabContent} rows={rows}
                order={this.state.order} orderBy={this.state.orderBy}
                rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                selected={this.state.selected} category={category}
                handleChange={this.handleChange} handleClick={handleClick} redirectID="ID"
                allowDelete={true} allowEdit={true}/>
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