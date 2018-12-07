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
            Firstname: 'Firstname',
            Lastname: 'Lastname',
            ID: "ID",
            RFID: "RFID",
            Phoneno: "Phoneno",
            ShiftStart: 'Shift Start',
            ShiftEnd: 'Shift End',
            Mute: 'Mute'
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
        console.log("Update button clicked");
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.userProfile.UserProfileReducer.data &&
            !isEqual(this.props.userProfile.UserProfileReducer.data !== prevProps.userProfile.UserProfileReducer.data)) {
                console.log(this.props.userProfile.UserProfileReducer.data[0], "*****");
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
                data={this.props.userProfile.UserProfileReducer.data ?
                    this.props.userProfile.UserProfileReducer.data[0] : 
                    this.state}
                onChange={this.handleChange}
                onClick={this.handleSubmit}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userProfile: state
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