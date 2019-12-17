import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles, Grid, CardContent,
    Typography, Card, CardHeader, IconButton,
    Divider, FormControl, InputLabel, TextField,
    Select, LinearProgress, List, ListItem} from '@material-ui/core';
import {isEqual} from 'lodash';
import ClearIcon from '@material-ui/icons/Clear';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import styles from './ProjectTeamDetailsStyle';
import CustomModal from '../../components/modal/Modal';
import {API_URLS, PROJECT_TABS, NAMESPACE_MAPPER,
    NAMESPACE, ALERT_LEVEL} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectDetailData} from '../../actions/ProjectDataAction';
import {profileData, profileDataUpdate} from '../../actions/UserProfileDataAction';
import UserProfileData from '../../components/userProfile/UserProfileData';
import {formatDateTime} from '../../utils/DateFormat';
import {capitalizeFirstLetter} from '../../utils/FormatStrings';

class ProjectInstallationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isEdit: false,
            deleteNotify: false,
            profileNotify: false,
            profile: {
                Firstname: '',
                Lastname: '',
                ID: "",
                RFID: "",
                Phonenum: "",
                ShiftStart: '',
                ShiftEnd: '',
                Mute: false,
                Desig: '',
                AlertMedium: ''
            },
            pid: props.match.params.pid,
            uid: props.match.params.uid,
            userLocation : {},
            loading: true,
        };
        this.info = false;
        this.earlyState = true;
    }
    
    handleModalState = (isEdit=false) => {
    /**
     * Handle the modal open and close state.
     * Modal shown to add a new allocation.
     */
        this.setState({'isEdit':isEdit,
            open: !this.state.open});
    };

    handleModalDeleteState = () => {
    /**
     * Handle Modal which pops up while deleting users allocation.
     * It is a confirmation modal
     */
        this.setState({ deleteNotify: !this.state.deleteNotify});
    };
                        
    handleModalProfileState = () => {
    /**
     * Handles Profile update modal.
     * On user profile update this will update
     * user for successfull user profile update
     */
        this.setState({ profileNotify: !this.state.profileNotify});
    }

    onAddtion = () => {
    /**
     * This will handle allocation of user to a new location.
     * Validating for required parameters and formating time and setting up some state variables
     * and finally calling the POST api.
     * Or showing up error to user to fill all required fields.
     */
        
        if(this.state.userLocation.Tags && this.state.userLocation.ShiftStart &&
            this.state.userLocation.ShiftEnd && this.state.userLocation.Level &&
            this.state.userLocation.InsID) {
            let startTime = formatDateTime(this.state.userLocation.ShiftStart, "hh:mm a", "HHmm"),
            endTime = formatDateTime(this.state.userLocation.ShiftEnd, "hh:mm a", "HHmm");
            this.setState({
                userLocation: {
                    ...this.state.userLocation,
                    Tags: Array.isArray(this.state.userLocation.Tags) ? this.state.userLocation.Tags : this.state.userLocation.Tags.split(','),
                    ShiftStart: startTime,
                    ShiftEnd: endTime
                }
            }, function() {
            const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
                        ${API_URLS['TEAM_ASSOCIATION']}`,
            config = getApiConfig(endPoint, 'POST', this.state.userLocation);
            this.props.onProfileData(config, 'POST');
            this.handleModalState();
            this.setState({userLocation: {UID: this.state.uid}})
            })
        } else {
            this.setState({errorMessage : "Please enter all valid details"})
        }
    }

    handleChange = (event, AlertMedium) => {
    /**
     * Common function to change the state variables.
     */
        let {name, value} = event.target;
        if (name === 'Mute') {
            value = event.target.checked
        }
        if (name === undefined) { // For AlertMedium
            name = 'AlertMedium';
            value = AlertMedium;
        }
        if (name === 'RFID') {
            this.setState({
                profile: {
                    ...this.state.profile,
                    SUB1: value,
                    [name]: value
                }
            });
        } else {
            this.setState({
                profile: {
                    ...this.state.profile,
                    [name]: value
                }
            });
        }
    }

    handleSubmit = () => {
    /**
     * Function to update the user profile. Call the POST api and show user an update message
     */
        const endPoint = `${API_URLS['USER_PROFILE']}`,
        param = {
            'uid': this.state.uid
        },
        config = getApiConfig(endPoint, 'POST', this.state.profile, param);
        this.props.onProfileData(config, 'POST');
        this.earlyState = false;
    }

    onDelete = () =>{
    /**
     * For removing allocation for a user, once user confirms for deletion,
     * this function will be called which will call the API and
     * update user profile(delete the allocation)
     */
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
                        ${API_URLS['TEAM_ASSOCIATION']}`,
            param = {
                'UID': this.state.uid,
                'InsID': this.state.deleteAsso
            },
            config = getApiConfig(endPoint, 'Delete', ' ', param);
        this.props.onProfileData(config, 'POST');
        this.handleModalDeleteState();
        this.info = false;
    }

    removeLocation = (insID, name) => {
    /**
     * While user will click on remove allocation,
     * a pop up will be shown to user.
     * This function will show up the pop up with required details.
     */
        this.setState({deleteAsso : insID})
        this.deleteInformation = `Do you Want Remove the User Association for location ${name}`;
        this.handleModalDeleteState();
    }

    editLocation = (insID, name) => {
        this.state.association.map((row) => {
            if(row.InsID === insID) {
                row['ShiftStart'] = formatDateTime(row.ShiftStart,"HHmm", "HH:mm")
                row['ShiftEnd'] = formatDateTime(row.ShiftEnd,"HHmm", "HH:mm")
                this.setState({userLocation: row}, function () {
                    this.handleModalState(true)
                })
            }
        })
        
    }

    addDetail = (event) => {
    /***
     * This function will be called to update the state while user selects a new allocation for any member.
     */
        let {name, value} = event.target;
        this.setState({
            userLocation: {
                ...this.state.userLocation,
                [name]: value
            }
        })
    }

    tagDetail = (event) => {
    /**
     * Tags is a list and by default 'cleaningIssues' has to be allocated
     * to every user allocated for any location.
     * Also the API is expecting tags as a list bt UI treats it as a text, comma seperated.
     * So this function will take care of these things.
     */
        let {name, value} = event.target;
        let newValue = ['cleaningIssues'];
        let valArray = value.split(',');
        if(valArray.length > 0) {
            for (let i = 0; i < valArray.length; i++) {
                newValue.push(valArray[i].trim())
            }
            newValue.concat(this.state.userLocation[name]);
            value = Array.from(new Set(newValue)).join(',')
        }
        this.setState({
            userLocation: {
                ...this.state.userLocation,
                [name]: value
            }
        })
    }

    getProfileData =() => {
    /**
     * Get the user profile data.
     * Call the API for same.
     */
        const endPoint = `${API_URLS['USER_PROFILE']}`,
            param = {
                'uid': this.state.uid
            },
            config = getApiConfig(endPoint, 'GET', '', param);
        this.props.onProfileData(config);
        if(!this.earlyState)
            this.handleModalProfileState();
    }

    componentDidMount() {
        if(this.props.projectSelected) {
            this.setState({
              projectSelected : this.props.projectSelected ? this.props.projectSelected : ''
            });
        }
        this.getProfileData();
    }

    getUserProfile = (userDetails) => {
    /**
     * Get complete user profile details, like users allocations and time and other details.
     * user details will be passed in and 
     * depending on namespace it will be either part of profile os association.
     */
        let profile, association = [];
        if(userDetails[0]) {
            userDetails.map((row) => {
                if(row.NS === NAMESPACE['USER_PROFILE'])
                    profile = row;
                if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS_ASSOC'] && row.PID === this.state.pid)
                    association.push(row);
            });
        } else {
            profile = userDetails;
        }
        return {profile: profile,
            association: association};
    }

    componentDidUpdate(prevProps, prevState) {
    /**
     * This part will listen to project selection change from the header component.
     * On any change this will be called and the data will be changed in UI
     * Reducer used - 'projectSelectReducer'.
     * It will update the URL to show up new PID selected.
     * and also make api call to update the user profile
     */
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)) {
            this.setState({projectSelected: this.props.projectSelected})
            if(this.state.pid !== this.props.projectSelected.PID)
                this.setState({pid: this.props.projectSelected.PID},
                function() {
                    let arr = this.props.match.url.split('/');
                    arr[3] = this.props.projectSelected.PID;
                    let url = arr.slice(0,4).join('/');;//arr.join('/');
                    this.info = false;
                    this.props.history.push(url);
                    this.getProfileData();
                });
        }

    /***
     * Check if profile data is there or location list is there,
     * this part is used to update the profile on UI and
     * also set the location list, allocated and remaining ones
     * on UI.
     */
        if ((this.props.userProfile || this.props.locationList) &&
            (!isEqual(this.props.userProfile, prevProps.userProfile) ||
            !isEqual(this.props.locationList, prevState.locationList))) {
            if(!this.info) {
                const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
                    ${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`,
                    config = getApiConfig(endPoint, 'GET');
                this.props.onProjectDetailData(config);
                this.info = true;
            }
            if (this.props.userProfile && this.props.userProfile.length > 0) {
                let userDetails = this.getUserProfile(this.props.userProfile);
                let profile = userDetails.profile,
                    userProfile = {'Firstname': profile.Firstname,
                        'Lastname': profile.Lastname ? profile.Lastname : prevState.profile.Lastname,
                        'Phonenum': profile.Phonenum ? profile.Phonenum : prevState.profile.Phonenum,
                        'Mute': profile.Mute ? profile.Mute : prevState.profile.Mute,
                        'AlertMedium': profile.AlertMedium ? profile.AlertMedium : prevState.profile.AlertMedium,
                        'Desig': profile.Desig ? profile.Desig : prevState.profile.Desig
                    },
                    SUB1, SUB2;
                if(profile['NS']) {
                    SUB1 = NAMESPACE_MAPPER[profile['NS']].SUB1;
                    SUB2 = NAMESPACE_MAPPER[profile['NS']].SUB2;
                    userProfile[SUB2]= profile.SUB2;// ? profile.SUB2 : prevState.profile.ID;
                    userProfile[SUB1]= profile.SUB1;// ? profile.SUB1 : prevState.profile.RFID;
                } else {
                    userProfile['ID']= prevState.profile.ID;
                    userProfile['RFID']= prevState.profile.RFID;
                }

                // if(!this.state.profile.Firstname) {
                    this.setState({
                        profile: userProfile,
                        userLocation: {
                            'UID': userProfile.ID,
                            'Mute': userProfile.Mute,
                        }
                    });
                // }
                
                if(this.props.locationList) {
                    let association = userDetails.association;
                    let locationList = this.props.locationList, SUB1, SUB2;
                    locationList.map((d) => {
                        SUB1 = NAMESPACE_MAPPER[d['NS']].SUB1;
                        SUB2 = NAMESPACE_MAPPER[d['NS']].SUB2;
                        d[SUB1] = d.SUB1;
                        d[SUB2] = d.SUB2;
                    });
                    association.map((dt) => {
                        locationList.map((d) => {
                            if(d.SUB1 === dt.InsID) {
                                dt['name'] = d.name;
                                dt['locn'] = d.locn;
                                d['assigned'] = true;
                            }
                        })
                    })
                    this.setState({association: association,
                        locationList: locationList,
                        // loading: false
                    });
                }
            } else {
                this.getProfileData();
            }
        }

    /**
     * Progress bar
     */
        if(this.state.loading) {
            this.setState({
                loading: false,
            })
        }
    }
    
    render() {
        let returnData;
        const {classes} = this.props;
        if(this.state.locationList) {
            // Add user to a new location modal content
            returnData = <div>
                {this.state.isEdit ?
                    <Typography variant="h6">
                        {this.state.userLocation.name} | {this.state.userLocation.locn}
                    </Typography>
                :
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-native-helper">Location</InputLabel>
                    <Select native
                        value={this.state.userLocation.InsID}
                        onChange={this.addDetail}
                        inputProps={{
                            name: 'InsID',
                            id: 'InsID',
                            }}>
                    <option value="" />
                    {this.state.locationList.map(function(loc) {
                        if(!loc.assigned)
                            return <option value={loc.insid} name={loc.insid} key={loc.insid} >
                                {loc.name} | {loc.locn}</option>
                    })}
                    </Select>
                </FormControl>
                }
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="ShiftStart"
                            name="ShiftStart"
                            label="Shift Start"
                            type="time"
                            placeholder="HHMM"
                            fullWidth
                            autoComplete="ShiftStart"
                            value={this.state.userLocation.ShiftStart}
                            onChange={this.addDetail}
                            InputLabelProps={{
                                shrink: true
                            }}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="ShiftEnd"
                            name="ShiftEnd"
                            label='Shift End'
                            type="time"
                            fullWidth
                            autoComplete="ShiftEnd"
                            placeholder="HHMM"
                            value={this.state.userLocation.ShiftEnd}
                            onChange={this.addDetail}
                            InputLabelProps={{
                                shrink: true
                            }}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="Tags"
                            name="Tags"
                            label="Tags"
                            fullWidth
                            autoComplete="Tags"
                            value={this.state.userLocation.Tags}
                            onChange={this.addDetail}
                            onBlur={this.tagDetail}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-native-helper">Level</InputLabel>
                            <Select native
                                value={this.state.userLocation.Level}
                                onChange={this.addDetail}
                                inputProps={{
                                    name: 'Level',
                                    id: 'Level',
                                    }}
                            >
                            <option value="" />
                            {ALERT_LEVEL.map(function(alert) {
                                    return <option value={alert.key} name={alert.key} key={alert.key} >
                                        {alert.display}</option>
                            })}
                            </Select>
                        </FormControl>
                    </Grid>
                    {this.state.errorMessage &&
                        <Grid item
                            container
                            alignItems='center'
                            direction='row'
                            justify='flex-end'
                            >
                            <Typography
                                variant="contained"
                                color="secondary"
                                >
                                {this.state.errorMessage}
                            </Typography>
                        </Grid>
                    }
                </Grid>
            </div>
        }

        return (
            <div className={classes.root}>
                {this.state.loading &&
                    <LinearProgress className={classes.buttonProgress}/>
                }
                
                <main className={classes.content}>
                { this.state.projectSelected &&
                <UserProfileData 
                    data={this.state}
                    onChange={this.handleChange}
                    onClick={this.handleSubmit}
                    handleModalProfileState={this.handleModalProfileState}/>
                }
                <Divider className={classes.seperator} />
                <Grid container spacing={24} className={classes.grid}>
                        <Grid item xs={12} sm={6}>
                            <Card className={classes.card}>
                                <CardHeader action={
                                    <IconButton>
                                        <AddCircleOutlineIcon onClick={event => this.handleModalState()}/>
                                    </IconButton>
                                    }
                                subheader="Location Assigned"/>
                                {this.state.association &&
                                    this.state.association.map((dt, i) => {
                                    // Display the allocated locations for the user per project
                                    // With Edit and Delete options for the selections.
                                    return <Card className={classes.card} key={i}>
                                        <CardHeader
                                            action={
                                            <IconButton className={classes.iconButton}>
                                                <EditIcon onClick={event => this.editLocation(dt.InsID, dt.name)}/>
                                                <ClearIcon onClick={event => this.removeLocation(dt.InsID, dt.name)}/>
                                            </IconButton>
                                            }
                                            title={dt.name}
                                            subheader={dt.locn}/>
                                            <CardContent>
                                                <Typography component="p">
                                                <b>Shift Start At :</b> {formatDateTime(dt.ShiftStart, "HHmm", "hh:mm A")}
                                                </Typography>
                                                <Typography component="p">
                                                <b>Shift Ends At :</b> {formatDateTime(dt.ShiftEnd, "HHmm", "hh:mm A")}
                                                </Typography>
                                                <Typography component="div">
                                                    <b>Tags associated :</b> 
                                                    <List dense={true}>
                                                    {dt.Tags.map((dt, index) => {
                                                        return <ListItem key={index}>
                                                        {capitalizeFirstLetter(dt)}
                                                        </ListItem>
                                                    })}
                                                    </List>
                                                </Typography>
                                                <Typography component="p">
                                                <b>Level :</b> {capitalizeFirstLetter(dt.Level)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    })
                                }
                            </Card>
                        </Grid>
                    </Grid>
                    {/* Modal for Associating user to new location */}
                    <CustomModal
                        header="Associate User with Location"
                        content={returnData}
                        handleClose={event => this.handleModalState()}
                        handleClick={this.onAddtion}
                        open={this.state.open}
                        showFooter={true}
                    />
                    {/* Modal for remove user from a particular/selected location */}
                    <CustomModal
                        header="Remove User Association"
                        content={this.deleteInformation}
                        handleClose={this.handleModalDeleteState}
                        handleClick={this.onDelete}
                        open={this.state.deleteNotify}
                        showFooter={true}
                    />
                </main>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        locationList : state.ProjectDetailsReducer.data,
        userProfile: state.UserProfileReducer.data,
        projectSelected : state.projectSelectReducer.data,
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
        onProjectDetailData: (config) => {
            dispatch(projectDetailData(config))
        },
        onProfileData: (config, type='') => {
            if (type === 'POST') {
                dispatch(profileDataUpdate(config))
            } else {
                dispatch(profileData(config))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectInstallationDetails));