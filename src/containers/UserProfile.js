import React, { Component } from 'react';
import { connect } from 'react-redux';
import {isEqual } from 'lodash';
import {withStyles} from '@material-ui/core';
import {API_URLS, NAMESPACE_MAPPER, NAMESPACE} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {profileData, profileDataUpdate} from '../actions/UserProfileDataAction';
import UserProfileData from '../components/userProfile/UserProfileData';
import styles from './projectTeamDetails/ProjectTeamDetailsStyle';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
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
            profileNotify: false
        };
        this.earlyState = true;
        this.state = this.initialState;
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
        this.earlyState = false;
        const endPoint = `${API_URLS['USER_PROFILE']}`,
        config = getApiConfig(endPoint, 'POST', this.state.profile);
        this.props.onProfileData(config, 'POST');
    }
    getUserProfile = (userDetails) => {
        let profile;
        userDetails.map((row) => {
            if(row.NS === NAMESPACE['USER_PROFILE'])
            profile = row;
        });
        return profile;
    }
    handleModalProfileState = () => {
        this.setState({ profileNotify: !this.state.profileNotify});
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.userProfile &&
        (!isEqual(this.props.userProfile, prevProps.userProfile) ||
            !this.state.profile.Firstname)) {
            const profile = this.props.userProfile[0] ? this.getUserProfile(this.props.userProfile): this.props.userProfile;
            let userProfile = {'Firstname': profile.Firstname,
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
            this.setState({
                profile: userProfile
            });
            if(!this.earlyState)
                this.handleModalProfileState();
        }
    }

    componentDidMount() {
        const endPoint = `${API_URLS['USER_PROFILE']}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onProfileData(config);
    }

    render(){
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <UserProfileData 
                data={this.state}
                onChange={this.handleChange}
                onClick={this.handleSubmit}
                handleModalProfileState={this.handleModalProfileState}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userProfile: state.UserProfileReducer.data
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProfileData: (config, type='') => {
            if (type === 'POST') {
                dispatch(profileDataUpdate(config))
            } else {
                dispatch(profileData(config))
            }
            
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserProfile));