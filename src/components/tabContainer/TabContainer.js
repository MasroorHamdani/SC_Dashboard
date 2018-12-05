import React, { Component } from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";
import Typography from '@material-ui/core/Typography';
import {PROJECT_TABS, SORTING, API_URLS} from '../../constants/Constant';
import EnhancedTable from '../grid/Grid';
import {projectDetailData} from '../../actions/ProjectDataAction';
import {getApiConfig} from '../../services/ApiCofig';

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
    }
   componentDidUpdate(prevProps, prevState) {
        if (this.props.projectData.ProjectDetailsReducer.data &&
            !isEqual(this.props.projectData.ProjectDetailsReducer.data !== prevProps.projectData.ProjectDetailsReducer.data)) {
                console.log(this.props.projectData.ProjectDetailsReducer.data, "*****");
            }
    }
    render() {
        const {category, data} = this.props;
        let tabData, rows, tabContent;

        if (data.ProjectDetailsReducer && data.ProjectDetailsReducer.data && category === PROJECT_TABS['INSTALLATION']) {
            tabContent = getMappedData(data.ProjectDetailsReducer.data);
            rows = [{ id: 'name', numeric: false, disablePadding: false, label: 'Name' },
                    { id: 'locn', numeric: false, disablePadding: false, label: 'Location' }]
            tabData = <Typography component="div" style={{ padding: 8 * 3 }}>
            <EnhancedTable data={tabContent.details} rows={rows}
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

function getMappedData (data) {
    let mappedData = {}, alerts = [], details = [], devices = [];
    data.map(function(d) {
        if (d['namespace'] === 'alerting') {
            alerts.push(d);
        } else if(d['namespace'] === 'details') {
            details.push(d);
        } else if(d['namespace'] === 'devices') {
            devices.push(d);
        }
        mappedData = {};
        mappedData['alerts'] = alerts;
        mappedData['devices'] = devices;
        mappedData['details'] = details;
       });
       return mappedData;
}

function mapStateToProps(state) {
    return {
        projectData : state,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectDetailData: (config) => {
            //will dispatch the async action
            dispatch(projectDetailData(config))
        }
    }
}
  export default connect(mapStateToProps, mapDispatchToProps)(TabContainer);