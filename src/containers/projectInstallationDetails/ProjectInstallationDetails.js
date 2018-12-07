import React, { Component } from 'react';
import {withStyles, Typography} from '@material-ui/core';
import styles from './ProjectInstallationDetailsStyle';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {PROJECT_TABS, API_URLS, SORTING} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {installationDeviceData} from '../../actions/InstallationDeviceData';
import EnhancedTable from '../../components/grid/Grid';

class ProjectInstallationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            insid: props.match.params.insid,
            order: SORTING['DECENDING'],
            orderBy: 'name',
            selected: [],
            page: 0,
            rowsPerPage: 5
        }
    }
    componentDidMount() {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
            ${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DEVICES']}/${this.state.insid}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onProjectInstallationData(config);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.installationDeviceData.InstallationDeviceReducer.data &&
        !isEqual(this.props.installationDeviceData.InstallationDeviceReducer.data !==
            prevProps.installationDeviceData.InstallationDeviceReducer.data)) {
            // console.log(this.props.installationDeviceData.InstallationDeviceReducer.data, "*****");
        }
    }

    handleClick = (e, id, category) => {
        // console.log('clicked');
    };
    handleChange = (name, value) => {
        this.setState({
            [name] : value
        });
    }
    render(){
        const {classes} = this.props;
        let installationData, tabData, rows;
        if(this.props.installationDeviceData.InstallationDeviceReducer &&
            this.props.installationDeviceData.InstallationDeviceReducer.data) {
                installationData = mapTeamData(this.props.installationDeviceData.InstallationDeviceReducer.data[0]);
                rows = [{ id: 'id', numeric: false, disablePadding: false, label: 'Name' },
                        { id: 'type', numeric: false, disablePadding: false, label: 'Location' }]
                tabData = <Typography component="div">
                <EnhancedTable data={installationData.details} rows={rows}
                    order={this.state.order} orderBy={this.state.orderBy}
                    rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                    selected={this.state.selected}
                    handleChange={this.handleChange} handleClick={this.handleClick}/>
                </Typography>
        }
            
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                <div>Installation Details</div>
                {tabData}
                </main>
            </div>
        )
    }
}
function mapTeamData(data) {
    data['details'].map(function (d) {
        d['name'] = d['id'];
        d['locn'] = d['type'];
        d['insid'] = d['id'];
        return(d)
    });
    return data;
}
function mapStateToProps(state) {
    return {
        installationDeviceData: state
    }
}
function mapDispatchToProps(dispatch) {
    return {
        onProjectInstallationData: (config) => {
            dispatch(installationDeviceData(config))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectInstallationDetails));