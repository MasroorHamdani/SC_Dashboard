import React, { Component } from 'react';
import { connect } from 'react-redux';
import {isEqual } from 'lodash';
import {API_URLS, HOUR_MIN_FORMAT, NAMESPACE_MAPPER} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {profileData, profileDataUpdate} from '../actions/UserProfileDataAction';
import UserProfileData from '../components/userProfile/UserProfileData';
import {getFormatedDateTime} from '../utils/DateFormat';

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
            }
        };
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
        const endPoint = `${API_URLS['USER_PROFILE']}`,
        config = getApiConfig(endPoint, 'POST', this.state.profile);
        this.props.onProfileData(config, 'POST');
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.userProfile &&
        (!isEqual(this.props.userProfile, prevProps.userProfile) ||
            !this.state.profile.Firstname)) {
            const profile = this.props.userProfile[0] ? this.props.userProfile[0]: this.props.userProfile;
            let userProfile = {'Firstname': profile.Firstname,
                'Lastname': profile.Lastname ? profile.Lastname : prevState.profile.Lastname,
                'Phonenum': profile.Phonenum ? profile.Phonenum : prevState.profile.Phonenum,
                'Mute': profile.Mute ? profile.Mute : prevState.profile.Mute
            };
            let SUB1, SUB2;
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