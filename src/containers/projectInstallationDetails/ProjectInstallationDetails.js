import React, { Component } from 'react';
import {Typography, InputLabel, Select, MenuItem, withStyles } from '@material-ui/core';
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
            url: props.match.url,
            insid: props.match.params.insid,
            order: SORTING['DECENDING'],
            orderBy: 'name',
            selected: [],
            page: 0,
            rowsPerPage: 5,
            insidList:[]
        }
    }
    componentDidMount() {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
            ${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DEVICES']}/${this.state.insid}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onProjectInstallationData(config);
        if(localStorage.getItem('installationLocations')) {
            this.setState( {
                insidList: localStorage.getItem('installationLocations').split(',')
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.installationDeviceData &&
        !isEqual(this.props.installationDeviceData !==
            prevProps.installationDeviceData)) {
            // console.log(this.props.installationDeviceData, "*****");
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
    handleSelectionChange = event => {
        let urlParam = this.state.url.split('/');
        urlParam[urlParam.length - 1] = event.target.value;
        let url = urlParam.join('/')
        window.location = url;
    };

    render(){
        const {classes} = this.props;
        let installationData, tabData, rows;
        if(this.props.installationDeviceData) {
                installationData = this.props.installationDeviceData[0];
                rows = [{ id: 'id', numeric: false, disablePadding: false, label: 'Name' },
                        { id: 'type', numeric: false, disablePadding: false, label: 'Location' }]
                tabData = <Typography component="div">
                    <InputLabel htmlFor="insid">Change Location</InputLabel>
                    <Select className={classes.select}
                        value={this.state.insid}
                        onChange={this.handleSelectionChange}
                        inputProps={{
                            name: 'insid',
                            id: 'insid',
                        }}
                    >
                    {this.state.insidList.map(function(insidValue) {
                        return <MenuItem value={insidValue} key={insidValue}>{insidValue}</MenuItem>
                    })}
                    </Select>
                <EnhancedTable data={installationData.details} rows={rows}
                    order={this.state.order} orderBy={this.state.orderBy}
                    rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                    selected={this.state.selected}
                    handleChange={this.handleChange} handleClick={this.handleClick} redirectID="id"/>
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
function mapStateToProps(state) {
    return {
        installationDeviceData: state.InstallationDeviceReducer.data
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