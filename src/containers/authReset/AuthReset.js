import React, {Component} from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";
import ResetPasswordComponent from '../../components/login/ResetPassword';
import {API_URLS, REACT_URLS} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {setAuthKey} from '../../actions/LoginAction';

class AuthReset extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            code: '',
            password: 'Password',
            confpassword: 'Password',
            email: localStorage.getItem('username'),
            loading: false,
            codeLabel: "Enter code sent tou your email ID",
            errorMessage: ''
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
        if (this.state.confpassword === this.state.password) {
            if (!this.state.loading) {
                this.setState({
                    errorMessage: ''
                })
              const endPoint = API_URLS['AUTH_RESET_PASSWORD'],
                    dataToPost = {
                    "uname": this.state.email,
                    "passwd": this.state.password,
                    "apikey": this.state.code,
                    "session": localStorage.getItem('session')
                  },
                  config = getApiConfig(endPoint, '', 'POST', dataToPost);
              this.props.onAuthReset(config);
                }
        } else {
            this.setState({
              errorMessage: "Password and Confirm Password should be same"
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.userData.LoginReducer.data
            && !isEqual(this.props.userData.LoginReducer, prevProps.userData.LoginReducer)) {
                const responseData = this.props.userData.LoginReducer.data;
                localStorage.setItem('idToken', responseData['AuthenticationResult']['IdToken']);
                localStorage.setItem('refreshToken', responseData['AuthenticationResult']['RefreshToken']);
                if (this.state.loading) {
                    this.setState({
                      loading: false,
                      success: true,
                    });
                }
                window.location = REACT_URLS['DASHBOARD'];
        }
    }

    render() {
        return(
            <ResetPasswordComponent onResetSubmit={this.handleSubmit} onChange={this.handleChange} data={this.state}/>
        )
    }
}
function mapStateToProps(state) {
    return {
        userData : state
    }
}
  
function mapDispatchToProps(dispatch) {
return {
    onAuthReset: (config) => {
        dispatch(setAuthKey(config))
    }
}
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthReset);