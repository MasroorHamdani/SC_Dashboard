import React, { Component } from 'react';
import { connect } from 'react-redux';
import {isEqual } from 'lodash';
import {API_URLS, HOUR_MIN_FORMAT} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {profileData, profileDataUpdate} from '../actions/UserProfileDataAction';
import UserProfileData from '../components/userProfile/UserProfileData';
import {getFormatedDateTime} from '../utils/DateFormat';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            Firstname: '',
            Lastname: '',
            ID: "",
            RFID: "",
            Phoneno: "",
            ShiftStart: '',
            ShiftEnd: '',
        };
        this.state = this.initialState;
    }
      
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        });
    }
    handleSubmit = () => {
        const endPoint = `${API_URLS['USER_PROFILE']}`,
        config = getApiConfig(endPoint, 'POST', this.state);
        this.props.onProfileData(config, 'POST');
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.userProfile &&
        !isEqual(this.props.userProfile, prevProps.userProfile)) {
            const profile = this.props.userProfile[0] ? this.props.userProfile[0]: this.props.userProfile;
            this.setState({'Firstname': profile.Firstname,
                'Lastname': profile.Lastname ? profile.Lastname : prevState.Lastname,
                'ID': profile.ID ? profile.ID: prevState.ID,
                'RFID': profile.RFID ? profile.RFID : prevState.RFID,
                'Phoneno': profile.Phoneno ? profile.Phoneno : prevState.Phoneno,
                'ShiftStart': profile.ShiftStart ? getFormatedDateTime(profile.ShiftStart, HOUR_MIN_FORMAT): 
                    getFormatedDateTime(prevState.ShiftStart, HOUR_MIN_FORMAT),
                'ShiftEnd': profile.ShiftEnd ? getFormatedDateTime(profile.ShiftEnd, HOUR_MIN_FORMAT) :
                    getFormatedDateTime(prevState.ShiftEnd, HOUR_MIN_FORMAT),
                'Mute': profile.Mute ? profile.Mute : prevState.Mute
            });
        }
    }

    componentDidMount() {
        const endPoint = `${API_URLS['USER_PROFILE']}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onProfileData(config);
    }

    render(){
        return (
            <div>
                <UserProfileData 
                data={this.state}
                onChange={this.handleChange}
                onClick={this.handleSubmit}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);