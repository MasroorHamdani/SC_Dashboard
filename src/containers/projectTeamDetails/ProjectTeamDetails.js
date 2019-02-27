import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles, Grid, CardContent,
    Typography, Card, CardHeader, IconButton,
    Divider, FormControl, InputLabel, TextField,
    Select, LinearProgress} from '@material-ui/core';
import {isEqual} from 'lodash';
import ClearIcon from '@material-ui/icons/Clear';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import styles from './ProjectTeamDetailsStyle';
import CustomModal from '../../components/modal/Modal';
import {API_URLS, PROJECT_TABS, NAMESPACE_MAPPER,
    NAMESPACE, ALERT_LEVEL} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectDetailData} from '../../actions/ProjectDataAction';
import {profileData, profileDataUpdate} from '../../actions/UserProfileDataAction';
import UserProfileData from '../../components/userProfile/UserProfileData';
import {formatDateTime} from '../../utils/DateFormat';

class ProjectInstallationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
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
                Mute: false
            },
            pid: props.match.params.pid,
            uid: props.match.params.uid,
            userLocation : {},
            loading: true,
            sucess: false
        };
        this.info = false;
        this.earlyState = true;
    }
    
    handleModalState = () => {
        this.setState({ open: !this.state.open});
    };
    handleModalDeleteState = () => {
        this.setState({ deleteNotify: !this.state.deleteNotify});
    };
                        
    handleModalProfileState = () => {
        this.setState({ profileNotify: !this.state.profileNotify});
    }
    onAddtion = () => {
        let startTime = formatDateTime(this.state.userLocation.ShiftStart, "HH:mm a", "HHMM"),
            endTime = formatDateTime(this.state.userLocation.ShiftEnd, "HH:mm a", "HHMM");
        if(this.state.userLocation.Tags && this.state.userLocation.ShiftStart &&
            this.state.userLocation.ShiftEnd && this.state.userLocation.Level &&
            this.state.userLocation.InsID) {
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
    handleChange = (event) => {
        let {name, value} = event.target;
        if (name === 'Mute') {
            value = event.target.checked
        }
        this.setState({
            profile: {
                ...this.state.profile,
                [name]: value
              }
        });
    }
    handleSubmit = () => {
        const endPoint = `${API_URLS['USER_PROFILE']}`,
        param = {
            'uid': this.state.uid
        },
        config = getApiConfig(endPoint, 'POST', this.state.profile, param);
        this.props.onProfileData(config, 'POST');
        this.earlyState = false;
    }
    onDelete = () =>{
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
        this.setState({deleteAsso : insID})
        this.deleteInformation = `Do you Want Remove the User Association for location ${name}`;
        this.handleModalDeleteState();
    }
    addDetail = (event) => {
        let {name, value} = event.target;
        this.setState({
            userLocation: {
                ...this.state.userLocation,
                [name]: value
            }
        })
    }
    tagDetail = (event) => {
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
        this.getProfileData();
    }
    getUserProfile = (userDetails) => {
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
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)){
            if(this.state.pid !== this.props.projectSelected.pid)
                this.setState({pid: this.props.projectSelected.pid},
                function() {
                    let arr = this.props.match.url.split('/');
                    arr[2] = this.props.projectSelected.pid;
                    let url = arr.join('/');
                    this.info = false;
                    this.props.history.push(url);
                    this.getProfileData();
                });
        }
        if ((this.props.userProfile || this.props.locationList) &&
            (!isEqual(this.props.userProfile, prevProps.userProfile) ||
            !isEqual(this.props.locationList, prevState.locationList))
            ) {
            if(!this.info) {
                const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
                    ${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`,
                    config = getApiConfig(endPoint, 'GET');
                this.props.onProjectDetailData(config);
                this.info = true;
            }
            if(this.props.userProfile.length >0) {
                let userDetails = this.getUserProfile(this.props.userProfile);
                let profile = userDetails.profile,
                    userProfile = {'Firstname': profile.Firstname,
                        'Lastname': profile.Lastname ? profile.Lastname : prevState.profile.Lastname,
                        'Phonenum': profile.Phonenum ? profile.Phonenum : prevState.profile.Phonenum,
                        'Mute': profile.Mute ? profile.Mute : prevState.profile.Mute
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
                if(!this.state.profile.Firstname) {
                    this.setState({
                        profile: userProfile,
                        userLocation: {
                            'UID': userProfile.ID,
                            'Mute': userProfile.Mute,
                        }
                    });
                }
                
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
                        locationList: locationList});
                }
            } else {
                this.getProfileData();
            }
        }
        if(this.state.loading) {
            this.setState({
                loading: false,
                sucess: true
            })
        }
      }
    
    render(){
        let returnData;
        const {classes} = this.props;
        if(this.state.locationList) {
            returnData = <div>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-native-helper">Location</InputLabel>
                    <Select native
                        value={this.state.userLocation.InsID}
                        onChange={this.addDetail}
                        inputProps={{
                            name: 'InsID',
                            id: 'InsID',
                            }}
                    >
                    <option value="" />
                    {this.state.locationList.map(function(loc) {
                        if(!loc.assigned)
                            return <option value={loc.insid} name={loc.insid} key={loc.insid} >
                                {loc.name} | {loc.locn}</option>
                    })}
                    </Select>
                </FormControl>
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
                    <LinearProgress/>
                }
                <main className={classes.content}>
                <UserProfileData 
                    data={this.state}
                    onChange={this.handleChange}
                    onClick={this.handleSubmit}
                    handleModalProfileState={this.handleModalProfileState}/>
                <Divider className={classes.seperator} />
                <Grid container spacing={24} className={classes.grid}>
                        <Grid item xs={12} sm={6}>
                            <Card className={classes.card}>
                                <CardHeader action={
                                    <IconButton>
                                        <AddCircleOutlineIcon onClick={this.handleModalState}/>
                                    </IconButton>
                                    }
                                subheader="Location Assigned"/>
                                {this.state.association &&
                                    this.state.association.map((dt, i) => {
                                    return <Card className={classes.card} key={i}>
                                        <CardHeader
                                            action={
                                            <IconButton>
                                                <ClearIcon onClick={event => this.removeLocation(dt.InsID, dt.name)}/>
                                            </IconButton>
                                            }
                                            title={dt.name}
                                            subheader={dt.locn}/>
                                            <CardContent>
                                                <Typography component="p">
                                                <b>Shift Start At :</b> {formatDateTime(dt.ShiftStart, "HHMM", "HH:mm A")}
                                                </Typography>
                                                <Typography component="p">
                                                <b>Shift Ends At :</b> {formatDateTime(dt.ShiftEnd, "HHMM", "HH:mm A")}</Typography>
                                                <Typography component="p">
                                                    <b>Tags associated :</b> {dt.Tags.map((dt, index) => {
                                                        return <span key={index}> {dt} </span>
                                                    })}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    })
                                }
                            </Card>
                        </Grid>
                    </Grid>
                    <CustomModal
                        header="Associate User with Location"
                        content={returnData}
                        handleClose={this.handleModalState}
                        handleClick={this.onAddtion}
                        open={this.state.open}
                        showFooter={true}
                    />
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