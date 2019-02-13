import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles, Grid, CardContent,
    Typography, Button, Card, CardHeader, IconButton,
    Divider, FormControl, InputLabel, TextField, Select} from '@material-ui/core';
import {isEqual} from 'lodash';
import ClearIcon from '@material-ui/icons/Clear';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import styles from './ProjectTeamDetailsStyle';
import CustomModal from '../../components/modal/Modal';
import {API_URLS, PROJECT_TABS, NAMESPACE_MAPPER,
    NAMESPACE} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectDetailData} from '../../actions/ProjectDataAction';
import {profileData, profileDataUpdate} from '../../actions/UserProfileDataAction';
import UserProfileData from '../../components/userProfile/UserProfileData';

class ProjectInstallationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
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
            info: false,
            userLocation : {}
        };
    }
    
    handleModalState = () => {
        this.setState({ open: !this.state.open});
    };
    
    onAddtion = () => {
        console.log("Add loction to user", this.state.userLocation);
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
                    ${PROJECT_TABS['TEAM_ASSOCIATION']}`,
        param = {
            'UID': this.state.uid
        },
        config = getApiConfig(endPoint, 'POST', this.state.userLocation, param);
        // this.props.onProfileData(config);

        this.handleModalState();
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
    }
    handleOnClick = () => {
        console.log("On Click handler");
    };
    removeLocation = (id) => {
        console.log("remove id from user list", id);
    }
    addDetail = (event) => {
        let {name, value} = event.target;
        if(name === 'Tags') {
            let newValue =['cleaningIssues'];
            // comma seperated list
            newValue.push(value);
            newValue.push(this.state.userLocation[name]);
            value= newValue;
        }
        this.setState({
            userLocation: {
                ...this.state.userLocation,
                [name]: value
            }
        })
    }
    componentDidMount() {
        const endPoint = `${API_URLS['USER_PROFILE']}`,
            param = {
                'uid': this.state.uid
            },
            config = getApiConfig(endPoint, 'GET', '', param);
        this.props.onProfileData(config);
    }
    getUserProfile = (userDetails) => {
        let profile, association = [];
        if(userDetails[0]) {
            userDetails.map((row) => {
                if(row.NS === NAMESPACE['USER_PROFILE'])
                    profile = row;
                if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS_ASSOC'])
                    association.push(row);
            });
        } else {
            profile = userDetails;
        }
        return {profile: profile,
            association: association};
    }
    componentDidUpdate(prevProps, prevState) {
        if ((this.props.userProfile || this.props.locationList) &&
            (!isEqual(this.props.userProfile, prevProps.userProfile) ||
            !isEqual(this.props.locationList, prevState.locationList))
            // && (!this.state.profile.Firstname || !this.state.association)
            ) {
            if(!this.state.info) {
                const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
                    ${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`,
                    config = getApiConfig(endPoint, 'GET');
                this.props.onProjectDetailData(config);
                this.setState({info: true})
            }
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
                userProfile[SUB2]= profile.SUB2 ? profile.SUB2 : prevState.profile.ID;
                userProfile[SUB1]= profile.SUB1 ? profile.SUB1 : prevState.profile.RFID;
            } else {
                userProfile['ID']= prevState.profile.ID;
                userProfile['RFID']= prevState.profile.RFID;
            }
            if(!this.state.profile.Firstname)
                this.setState({
                    profile: userProfile,
                    userLocation: {
                        'UID': userProfile.userProfile,
                        'Mute': userProfile.Mute,
                    }
                });
            
            if(this.props.locationList) {
                let association = userDetails.association;
                let locationList = this.props.locationList, SUB1, SUB2;
                association.map((dt) => {
                    locationList.map((d) => {
                        if(d.SUB1 === dt.InsID) {
                            dt['name'] = d.name;
                            dt['locn'] = d.locn;
                            d['assigned'] = true;
                        }
                        SUB1 = NAMESPACE_MAPPER[d['NS']].SUB1;
                        SUB2 = NAMESPACE_MAPPER[d['NS']].SUB2;
                        d[SUB1] = d.SUB1;
                        d[SUB2] = d.SUB2;
                    })
                })
                if(!this.state.association)
                    this.setState({association: association});
                    this.setState({locationList: locationList})
              }
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
                                        fullWidth
                                        autoComplete="ShiftStart"
                                        value={this.state.userLocation.ShiftStart}
                                        onChange={this.addDetail}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="ShiftEnd"
                                        name="ShiftEnd"
                                        label='Shift End'
                                        fullWidth
                                        autoComplete="ShiftEnd"
                                        value={this.state.userLocation.ShiftEnd}
                                        onChange={this.addDetail}
                                    />
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
                                        onChange={this.addDetail}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="Level"
                                        name="Level"
                                        label='Level'
                                        fullWidth
                                        autoComplete="Level"
                                        value={this.state.userLocation.Level}
                                        onChange={this.addDetail}
                                    />
                                </Grid>
                                {/* <Grid item
                                    container
                                    alignItems='center'
                                    direction='row'
                                    justify='flex-end'>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.handleOnClick}>
                                        Assign Location
                                    </Button>
                                </Grid> */}
                            </Grid>
                        </div>
            // returnData = this.state.locationList.map((loc, id) => {
            //    if(!loc.assigned)
            //         return (
            //             <Card key={id}>
            //                 <CardHeader
            //                     avatar={
            //                         <IconButton>
            //                             <LocationCityIcon className={classes.icon}/>
            //                         </IconButton>
            //                         }
            //                     action={
            //                     <IconButton>
            //                         <AddCircleOutlineIcon onClick={event => this.addLocation(id)}/>
            //                     </IconButton>
            //                     }
            //                     title = {loc.name}
            //                     subheader={loc.locn}/>
            //             </Card>
            //         )
            //   })
        }
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                <UserProfileData 
                    data={this.state}
                    onChange={this.handleChange}
                    onClick={this.handleSubmit}/>
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
                                                <ClearIcon onClick={event => this.removeLocation(i)}/>
                                            </IconButton>
                                            }
                                            title={dt.name}
                                            subheader={dt.locn}/>
                                            <CardContent>
                                                <Typography component="p">
                                                    Roles : {dt.Tags.map((dt, index) => {
                                                        return <span key={index}> {dt} &nbsp;</span>
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
                </main>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        locationList : state.ProjectDetailsReducer.data,
        userProfile: state.UserProfileReducer.data
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