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
            Firstname: '',
            Lastname: '',
            ID: "",
            RFID: "",
            Phonenum: "",
            ShiftStart: '',
            ShiftEnd: '',
            Mute: false
        };
        this.state = this.initialState;
    }
      
    handleChange = (event) => {
        let {name, value} = event.target;
        if (name === 'Mute') {
            value = event.target.checked
        }
        console.log({name, value});
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
                // [SUB2]: profile.SUB2 ? profile.SUB2 : prevState.ID,
                // [SUB1]: profile.SUB1 ? profile.SUB1 : prevState.RFID,
                'Phonenum': profile.Phonenum ? profile.Phonenum : prevState.Phonenum,
                'Mute': profile.Mute ? profile.Mute : prevState.Mute
            });
            let SUB1, SUB2;
            if(profile['NS']) {
                SUB1 = NAMESPACE_MAPPER[profile['NS']].SUB1;
                SUB2 = NAMESPACE_MAPPER[profile['NS']].SUB2;
                this.setState({
                    [SUB2]: profile.SUB2 ? profile.SUB2 : prevState.ID,
                    [SUB1]: profile.SUB1 ? profile.SUB1 : prevState.RFID,
                })
            }
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