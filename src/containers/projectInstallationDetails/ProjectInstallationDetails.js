import React, { Component } from 'react';
import {Typography, InputLabel, Select, MenuItem, withStyles } from '@material-ui/core';
import styles from './ProjectInstallationDetailsStyle';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {PROJECT_TABS, API_URLS, SORTING} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {installationDeviceData} from '../../actions/InstallationDeviceData';
import EnhancedTable from '../../components/grid/Grid';
import { NamespacesConsumer } from 'react-i18next';

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
        this.getInstallationDetails();
    }
    getInstallationDetails = () => {
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
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)){
            if(this.state.pid !== this.props.projectSelected.PID)
                this.setState({pid: this.props.projectSelected.PID},
                function() {
                    let arr = this.props.match.url.split('/');
                    arr[2] = this.props.projectSelected.PID;
                    let url = arr.join('/');
                    this.info = false;
                    this.props.history.push(url);
                    this.getInstallationDetails();
                });
        }
        if (this.props.installationDeviceData &&
        !isEqual(this.props.installationDeviceData,
            prevProps.installationDeviceData)) {
            // console.log(this.props.installationDeviceData, "*****");
        }
    }

    handleClick = (e, id, category) => {
        // console.log('clicked', id);
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
                installationData = this.props.installationDeviceData;
                rows = [{ id: 'Display', numeric: false, disablePadding: false, label: 'Name' },
                        { id: 'Devid', numeric: false, disablePadding: false, label: 'Device Id' },
                        { id: 'Type', numeric: false, disablePadding: false, label: 'Type' }]
                tabData = <NamespacesConsumer>
                {
                t=><Typography component="div">
                    <InputLabel htmlFor="insid">{t('changeLocn')}</InputLabel>
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
                <EnhancedTable data={installationData} rows={rows}
                    order={this.state.order} orderBy={this.state.orderBy}
                    rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                    selected={this.state.selected}
                    handleChange={this.handleChange} handleClick={this.handleClick} redirectID="Devid"/>
                </Typography>
                }</NamespacesConsumer>
        }
            
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                {tabData}
                </main>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        installationDeviceData: state.InstallationDeviceReducer.data,
        projectSelected : state.projectSelectReducer.data,
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