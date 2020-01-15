import React, { Component } from 'react';
import {Typography, InputLabel, Select, MenuItem,
    withStyles, Grid, TextField} from '@material-ui/core';
import styles from './ProjectInstallationDetailsStyle';
import {connect} from 'react-redux';
import {isEqual, groupBy} from 'lodash';
import {PROJECT_TABS, API_URLS, SORTING,
    ROLES} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {installationDeviceData, updateDeviceData,
    initialiseInstallationState} from '../../actions/InstallationDeviceData';
import EnhancedTable from '../../components/grid/Grid';
import { NamespacesConsumer } from 'react-i18next';
import CustomModal from '../../components/modal/Modal'
import CustomPopOver from '../../components/modal/PopOver';

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
            insidList:[],
            installlation: {
                Type: '',
                BoardRevision: '',
                Devid: '',
                SubType: '',
                Alias: ''
            },
            openModal: false,
            deviceUpdateError: false,
            deviceError: ''
        }
    }
    componentDidMount() {
    /**
     * Call get installation function.
     */
        if(this.props.projectSelected) {
            this.setState({
                projectSelected : this.props.projectSelected ? this.props.projectSelected : ''
            });
        }
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
                insidList: JSON.parse(localStorage.getItem('installationLocations'))
            })
        }
    }

    // componentWillUnmount() {
    //     this.props.onInitialState();
    // }

    componentDidUpdate(prevProps, prevState) {
    /**
     * On change in project selected from header,
     * it will get the value of new pid and set as part of the url.
     * As this URL/Page has insid as well part of URL, which we can't get at first,
     * So this will redirect page to basic project team page.
     */
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)) {
            this.setState({
                projectSelected: this.props.projectSelected
            });

            if(this.state.pid !== this.props.projectSelected.PID)
                this.setState({pid: this.props.projectSelected.PID},
                function() {
                    let arr = this.props.match.url.split('/');
                    if(arr[1] === "project") {
                        arr[2] = this.props.projectSelected.PID;
                        let url = arr.slice(0,3).join('/');
                        this.props.history.push(url);
                    } else {
                        arr[3] = this.props.projectSelected.PID;
                        let url = arr.slice(0,4).join('/');
                        this.props.history.push(url);
                    }
                });
        }
    /**
     * Just for testing as oe now
     */
        if (this.props.installationDeviceData &&
        !isEqual(this.props.installationDeviceData,
            prevProps.installationDeviceData)) {
            this.setState({
                installationDeviceData: this.props.installationDeviceData,
                installationGroup: groupBy(this.props.installationDeviceData,  'Alias')//'Devid')
            })
        }
        if (this.props.installationUpdate &&
            !isEqual(this.props.installationUpdate,
                prevProps.installationUpdate)) {
                let deviceUpdated = this.props.installationUpdate;
                if(deviceUpdated.status === 200) {
                    this.getInstallationDetails()
                } else if (deviceUpdated.status === 400) {
                    this.setState({
                        loading: false,
                        deviceError: deviceUpdated.data.message,
                        deviceUpdateError: true
                    });
                }
        }
    }

    handleClick = (e, id, category) => {
    /**
     * Function which will handle any click on the row.
     */
        this.setState({
            openModal: !this.state.openModal,
            installlation: this.state.installationGroup[id][0]
        })
    };

    handleClose = () => {
        this.setState({
            openModal: !this.state.openModal,
        })
    }

    handleErrorClose = () => {
        this.setState({
            deviceUpdateError: false,
            deviceError: ''
        })
    }

    handleChange = (name, value) => {
        this.setState({
            [name] : value
        });
    }

    handleInstallationChange = (event) => {
        let {name, value} = event.target;
        this.setState({
            'installlation': {
                ...this.state.installlation,
                [name]: value
            }
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

    onAddtion = () => {
        if(this.state.installlation.Devid && this.state.installlation.Type) {
            const endPoint = `${API_URLS['DEVICE_UPDATE']}/${this.state.pid}${API_URLS['INSTALLATION']}/
                            ${this.state.insid}/${this.state.installlation.Alias}
                            ${API_URLS['DEVICE_ASSIGN']}`,
                dataToPost = {
                    "DevType": this.state.installlation.Type,
                    "BoardRevision": this.state.installlation.BoardRevision,
                    "Devid": this.state.installlation.Devid,
                    "DevSubType": this.state.installlation.SubType
                },
                param = {
                    confirmOverride: true
                },
                config = getApiConfig(endPoint, 'POST', dataToPost, param);
            this.props.onDeviceUpdate(config);
            this.handleClose();
        } else {
            this.setState({
                error: 'Please Enter All details'
            })
        }
    }

    render() {
        const {classes} = this.props;
        let installationData, tabData, rows, searchList;
        if(this.state.installationDeviceData && this.state.projectSelected) {
            installationData = this.state.installationDeviceData;
            rows = [{ id: 'Display', numeric: 'center', disablePadding: false, label: 'Name' },
                    { id: 'Devid', numeric: 'center', disablePadding: false, label: 'Device Id' },
                    { id: 'Type', numeric: 'center', disablePadding: false, label: 'Type' },
                    { id: 'Alias', numeric: 'center', disablePadding: false, label: 'Alias' },
                    { id: 'BoardRevision', numeric: 'center', disablePadding: false, label: 'BoardRevision' }];
            searchList = [{ id: 'Display', label: 'Name' },
                    { id: 'Devid', label: 'Device Id' },
                    { id: 'Type', label: 'Type' },
                    { id: 'Alias', label: 'Alias'}];
            tabData =
                <EnhancedTable data={installationData} rows={rows}
                    order={this.state.order} orderBy={this.state.orderBy}
                    rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                    selected={this.state.selected}
                    searchList={searchList}
                    handleChange={this.handleChange}
                    handleClick={this.handleClick}
                    redirectID="Alias"//"Devid"
                    noView={true}
                    allowEdit={this.state.projectSelected.Role === ROLES['SC_ADMIN'] ||
                        this.state.projectSelected.Role === ROLES['PARTNER_ADMIN'] ||
                        this.state.projectSelected.Role === ROLES['PROJECT_ADMIN']?
                        true : false}/>
        }

        let returnData = <Grid container spacing={16}>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="Type"
                    name="Type"
                    label="Device Type"
                    fullWidth
                    autoComplete="Device Type"
                    value={this.state.installlation.Type}
                    onChange={this.handleInstallationChange}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="Devid"
                    name="Devid"
                    label="Device Id"
                    fullWidth
                    autoComplete="Device Id"
                    value={this.state.installlation.Devid}
                    onChange={this.handleInstallationChange}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="BoardRevision"
                    name="BoardRevision"
                    label="Board Revision"
                    fullWidth
                    autoComplete="Board Revision"
                    value={this.state.installlation.BoardRevision}
                    onChange={this.handleInstallationChange}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="SubType"
                    name="SubType"
                    label="Device Sub Type"
                    fullWidth
                    autoComplete="Device Sub Type"
                    value={this.state.installlation.SubType}
                    onChange={this.handleInstallationChange}/>
            </Grid>
            {this.state.error &&
                <Grid item
                    xs={24} sm={12}>
                    <Typography
                        variant="contained"
                        color="secondary">
                        {this.state.error}
                    </Typography>
                </Grid>
            }
        </Grid>
        
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
                    <Typography className={classes.pageHeader}>Installation Details /</Typography>
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
                            return <MenuItem value={insidValue.key} key={insidValue.key}>{insidValue.display}</MenuItem>
                        })}
                        </Select>
                    {tabData}
                    </Typography>
                    { this.state.openModal &&
                        <CustomModal
                            header="Update Installation Details"
                            content={returnData}
                            handleClose={this.handleClose}
                            handleClick={this.onAddtion}
                            open={this.state.openModal}
                            showFooter={true}/>
                    }
                </main>
                {this.state.deviceUpdateError &&
                    <CustomPopOver content={this.state.deviceError} open={this.state.deviceUpdateError}
                        handleClose={this.handleErrorClose} variant='error'/>
                }
            </div>
            }</NamespacesConsumer>
        )
    }
}
function mapStateToProps(state) {
    return {
        installationDeviceData: state.InstallationDeviceReducer.data,
        projectSelected : state.projectSelectReducer.data,
        installationUpdate: state.InstallationDevReducer.data
    }
}
function mapDispatchToProps(dispatch) {
    return {
        onProjectInstallationData: (config) => {
            dispatch(installationDeviceData(config))
        },
        onDeviceUpdate: (config) => {
            dispatch(updateDeviceData(config))
        },
        onInitialState: () => {
            dispatch(initialiseInstallationState())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectInstallationDetails));