import React, { Component } from 'react';
import {withStyles, Typography,  RadioGroup, FormControlLabel,
    Radio, FormControl, ListItem, FormLabel} from '@material-ui/core';

import {PROJECT_STATUS, SORTING} from '../../constants/Constant';
// import EnhancedTable from '../grid/Grid';

import styles from './ProjectListStyle';

class TabData extends Component {
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

    render() {
    /**
     * Check for the tab value and accordingly call the Grid component 'EnhancedTable'
     * Generate the rows list which will have details like id, if it is numeric or not,
     * if disabled or not and lable for the header.
     * Apart from that, orderby is passed, whcih defines, which will be the default column for setting order
     * and order will be asc or desc,
     * rowsPerPage  will defines how many results to be shown per page.
     * page will define the number of pages as per the values we have,
     * all these calculations will be doen in main container.
     * handleClick - Function to handle clicking on any Grid row
     * category is the selected tab value
     * redirectID will be used in handleClick function,
     *      which means pass this key value as parameter to called function
     * allowDelete is passed as true or false, by default it will be false.
     *      It will specify if table will show up delete column of not
     * allowEdit is passed as true or false, by default it will be false.
     *      It will specify if table will show up edit column of not
     */
        const {classes, stateData, handleChange} = this.props;
        let tabData, rows, searchList;
        if(stateData.projectList && stateData.tabValue === PROJECT_STATUS['PENDING']) {
            // rows = [{ id: 'Firstname', numeric: 'left', disablePadding: false, label: 'Firstname' },
            //         { id: 'Lastname', numeric: 'left', disablePadding: false, label: 'LastName' },
            //         { id: 'Role', numeric: 'left', disablePadding: false, label: 'Role' },
            //         { id: 'Status', numeric: 'left', disablePadding: false, label: 'Status' },
            //         { id: 'Association', numeric: 'left', disablePadding: false, label: 'Association'}
            //     ];
            // searchList = [{ id: 'Firstname', label: 'Firstname' },
            //         { id: 'Lastname', label: 'LastName' },
            //         { id: 'Role', label: 'Role' },
            //         { id: 'Status', label: 'Status' },
            //     ]
            tabData = <Typography component="div">
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Pending Projects</FormLabel>
                    <RadioGroup
                        aria-label="Gender"
                        name="gender1"
                        className={classes.group}
                        value={stateData.selectedPid}
                        onChange={handleChange}>
                        {stateData.projectList.map(function(row, index) {
                            let name = `${row.site} (${row.site_addr})`;
                            return <FormControlLabel key={index}
                                value={row.PID} control={<Radio />} label={name}/>

                        })}
                    </RadioGroup>
                </FormControl>
            {/* <EnhancedTable data={stateData.teamInfo} rows={rows}
                order={this.state.order} orderBy={this.state.orderBy}
                rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                selected={this.state.selected} category={category}
                searchList={searchList}
                handleChange={this.handleChange} handleClick={handleClick} redirectID="UID"
                allowDelete={false} allowEdit={true}/> */}
            </Typography>
        } else if (stateData.projectList && stateData.tabValue === PROJECT_STATUS['ACTIVE']) {
            // rows = [{ id: 'name', numeric: 'left', disablePadding: false, label: 'Name' },
            //         { id: 'locn', numeric: 'left', disablePadding: false, label: 'Location' }];
            // searchList = [{ id: 'name', label: 'Name' },
            //         { id: 'locn', label: 'Location' }];
            tabData = <Typography component="div">
            {/* <EnhancedTable data={data} rows={rows}
                order={this.state.order} orderBy={this.state.orderBy}
                rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                selected={this.state.selected} category={category}
                searchList={searchList}
                handleChange={this.handleChange} handleClick={handleClick} redirectID="insid"/> */}
                Active project list
            </Typography>
        }
        return (
            <div>
            {tabData}
            </div>
        );
    }
}
export default withStyles(styles)(TabData);