import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
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

    // handleClick = (e, param) => {
    //     // const { selected } = this.state;
    //     // const selectedIndex = selected.indexOf(id);
    //     // let newSelected = [];
    
    //     // if (selectedIndex === -1) {
    //     //   newSelected = newSelected.concat(selected, id);
    //     // } else if (selectedIndex === 0) {
    //     //   newSelected = newSelected.concat(selected.slice(1));
    //     // } else if (selectedIndex === selected.length - 1) {
    //     //   newSelected = newSelected.concat(selected.slice(0, -1));
    //     // } else if (selectedIndex > 0) {
    //     //   newSelected = newSelected.concat(
    //     //     selected.slice(0, selectedIndex),
    //     //     selected.slice(selectedIndex + 1),
    //     //   );
    //     // }
    //     // this.setState({ selected: newSelected });
    //   };

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
                handleChange={this.handleChange} handleClick={handleClick}/>
            </Typography>
        } else if(data.ProjectTeamDataReducer && data.ProjectTeamDataReducer.data && category === PROJECT_TABS['TEAM']) {
            tabContent = mapTeamData(data.ProjectTeamDataReducer.data[0].users);
            rows = [{ id: 'id', numeric: false, disablePadding: false, label: 'User Id' },
                    { id: 'status', numeric: false, disablePadding: false, label: 'Status' }]
            tabData = <Typography component="div">
            <EnhancedTable data={tabContent} rows={rows}
                order={this.state.order} orderBy={this.state.orderBy}
                rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                selected={this.state.selected} category={category}
                handleChange={this.handleChange} handleClick={handleClick}/>
            </Typography>
        }
        return (
            <div>
            {tabData}
            </div>
        );
    }
}

function mapTeamData(data) {
    data.map(function (d) {
        d['name'] = d['id'];
        d['locn'] = d['status'];
        d['insid'] = d['id'];
        return(d)
    });
    return data;
}

export default TabContainer;