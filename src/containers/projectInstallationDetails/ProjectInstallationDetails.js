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
    /**
     * Call get installation function.
     */
        this.getInstallationDetails();
    }
    getInstallationDetails = () => {
    /**
     * Get the installation for the passed pid from URL and insid from URL as well.
     */
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
    /**
     * On change in project selected from header,
     * it will get the value of new pid and set as part of the url.
     * As this URL/Page has insid as well part of URL, which we can't get at first,
     * So this will redirect page to basic project team page.
     */
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)){
            if(this.state.pid !== this.props.projectSelected.PID)
                this.setState({pid: this.props.projectSelected.PID},
                function() {
                    let arr = this.props.match.url.split('/');
                    arr[2] = this.props.projectSelected.PID;
                    let url = arr.slice(0,3).join('/');
                    this.props.history.push(url);
                });
        }
    /**
     * Just for testing as oe now
     */
        if (this.props.installationDeviceData &&
        !isEqual(this.props.installationDeviceData,
            prevProps.installationDeviceData)) {
            // console.log(this.props.installationDeviceData, "*****");
        }
    }

    handleClick = (e, id, category) => {
    /**
     * Function which will handle any click on the row.
     */
        // console.log('clicked', id);
    };
    handleChange = (name, value) => {
        this.setState({
            [name] : value
        });
    }
    handleSelectionChange = event => {
    /**
     * Handle the change from drop down
     * set the insid value for state,
     * once that is done recall the installation device function
     * and set the url to new insid value
     */
        this.setState({
            'insid' : event.target.value
        }, function() {
            this.getInstallationDetails();
            this.props.history.push(event.target.value);
        });
    };

    render(){
        const {classes} = this.props;
        let installationData, tabData, rows;
        if(this.props.installationDeviceData) {
            installationData = this.props.installationDeviceData;
            rows = [{ id: 'Display', numeric: 'center', disablePadding: false, label: 'Name' },
                    { id: 'Devid', numeric: 'center', disablePadding: false, label: 'Device Id' },
                    { id: 'Type', numeric: 'center', disablePadding: false, label: 'Type' }]
            tabData =
                <EnhancedTable data={installationData} rows={rows}
                    order={this.state.order} orderBy={this.state.orderBy}
                    rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                    selected={this.state.selected}
                    handleChange={this.handleChange} handleClick={this.handleClick} redirectID="Devid"/>
        }
            
        return (
            <NamespacesConsumer>
            {
            t=><div className={classes.root}>
                <main className={classes.content}>
                {/**
                * Dropdown with location list,
                * user can directly change the insid from drop down
                * rather then moving back and selecting next location
                */}
                <Typography component="div">
                    <InputLabel htmlFor="insid">{t('changeLocn')}</InputLabel>
                    <Select className={classes.select}
                        value={this.state.insid}
                        onChange={this.handleSelectionChange}
                        inputProps={{
                            name: 'insid',
                            id: 'insid',
                        }}>
                    {this.state.insidList.map(function(insidValue) {
                        return <MenuItem value={insidValue} key={insidValue}>{insidValue}</MenuItem>
                    })}
                    </Select>
                {tabData}
                </Typography>
                </main>
            </div>
            }</NamespacesConsumer>
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