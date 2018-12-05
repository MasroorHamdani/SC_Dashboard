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
            rowsPerPage: 5,
        }
    }

    handleChange = (name, value) => {
        this.setState({
            [name] : value
        });
        // this.setState({ data })
    }
    getMappedData = (data) => {
        let mappedData = [];
        for (var key in data) {
            data[key]['key']=key
            mappedData.push(data[key])
          }
          return mappedData;
    }
    render() {
        const {data, category} = this.props;
        let tabData;
        
        if (data.data && category === PROJECT_TABS['INSTALLATION']) {
            const tableData = this.getMappedData(data.data.Item.installations),
            rows = [{ id: 'name', numeric: false, disablePadding: true, label: 'Name' },
            { id: 'locn', numeric: true, disablePadding: false, label: 'Location' }]


            tabData = <Typography component="div" style={{ padding: 8 * 3 }}>
            <EnhancedTable data={tableData} rows={rows}
                order={this.state.order} orderBy={this.state.orderBy}
                rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                handleChange={this.handleChange}/>
            </Typography>
        } else if(category === PROJECT_TABS['TEAM']) {
            tabData = <Typography component="div" style={{ padding: 8 * 3 }}>TEAM</Typography>
        }
        return (
            <div>
            {tabData}
            </div>

        
        );
    }
  }
  export default TabContainer;