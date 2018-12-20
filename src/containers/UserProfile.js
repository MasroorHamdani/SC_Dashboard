import React, { Component } from 'react';
import { connect } from 'react-redux';
import {isEqual } from 'lodash';
import {API_URLS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {profileData} from '../actions/UserProfileDataAction';
import UserProfileData from '../components/userProfile/UserProfileData';

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
        // console.log("Update button clicked");
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.userProfile &&
        !isEqual(this.props.userProfile, prevProps.userProfile)) {
            const profile = this.props.userProfile[0];
            this.setState({'Firstname': profile.Firstname,
                'Lastname': profile.Lastname,
                'ID': profile.ID,
                'RFID': profile.RFID,
                'Phoneno': profile.Phoneno,
                'ShiftStart': profile.ShiftStart,
                'ShiftEnd': profile.ShiftEnd,
                'Mute': profile.Mute
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
        onProfileData: (config) => {
            dispatch(profileData(config))
        }
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);