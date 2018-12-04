import React from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";

import { API_URLS, X_API_KEY, REACT_URLS, RESET_PASSWORD_REQUIRED,
  LOGIN_STATUS } from "../constants/Constant";
import LoginComponent from "../components/login/Login";
import { userLogin } from "../actions/LoginAction";
import { getApiConfig } from '../services/ApiCofig';
import {forgotPassword} from '../actions/ForgotPasswordAction';
import {resetPassword} from '../actions/ResetPasswordAction';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
        username: 'Username',
        password: 'Password',
        confpassword: "Password",
        loading: false,
        success: false,
        email: 'Email',
        status: 'login',
        vercode: '',
        vercodeLabel: "Enter Verification code",
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
  handleForgotOnClick = () => {
    this.setState({ status: LOGIN_STATUS['FORGOT'] });
  };
  handleForgotSubmit = () => {
    const endPoint = API_URLS['FORGOT_PASSWORD'],
          dataToPost = {
          "uname": this.state.email
        },
        config = getApiConfig(endPoint, '', 'POST', dataToPost);
    this.props.onForgotPassword(config);
  }
  handleResetSubmit = () => {
    if (this.state.confpassword === this.state.password) {
      if (!this.state.loading) {
        this.setState(
          {
            success: false,
            loading: true,
            errorMessage: ''
          });
      const endPoint = API_URLS['RESET_PASSWORD'],
      dataToPost = {
        "uname": this.state.email,
        "vercode": this.state.vercode,
        "newpass": this.state.password
      },
      config = getApiConfig(endPoint, '', 'POST', dataToPost);
      this.props.onResetPassword(config);
      // this.setState({ status: "login" });
    }
  } else {
    this.setState({
      errorMessage: "Password and Confirm Password should be same"
    });
  }
}
handleSubmit = () => {
  if (!this.state.loading) {
    this.setState(
      {
        success: false,
        loading: true,
      })
  const endPoint = API_URLS['LOGIN'],
        dataToPost = {
        "uname": this.state.username,
        "passwd": this.state.password
      },
      config = getApiConfig(endPoint, X_API_KEY, 'POST', dataToPost);
  this.props.onLogin(config);
    }
}
componentDidUpdate(prevProps, prevState) {
  if (this.props.userData.LoginReducer.data
    && !isEqual(this.props.userData.LoginReducer, prevProps.userData.LoginReducer)) {
    const responseData = this.props.userData.LoginReducer.data;
    if (responseData['statusCode'] === 400) {
      this.setState({
        errorMessage: responseData['message']
      });
      if (this.state.loading) {
        this.setState({
          loading: false,
          success: true,
        });
      }
    } else if (responseData['ChallengeName'] === RESET_PASSWORD_REQUIRED) {
      this.props.history.push(REACT_URLS['AUTH_RESET']);
    } else {
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
  if (this.props.userData.ForgotPasswordReducer.data
    && !isEqual(this.props.userData.ForgotPasswordReducer, prevProps.userData.ForgotPasswordReducer)) {
      this.setState({ status: LOGIN_STATUS['RESET'] })
  }
  if (this.props.userData.ResetPasswordReducer.data
    && !isEqual(this.props.userData.ResetPasswordReducer, prevProps.userData.ResetPasswordReducer)) {
      if (this.state.loading) {
        this.setState({
          loading: false,
          success: true,
        });
      }
      this.props.history.push(REACT_URLS['LOGIN'])
  }
}
render() {
    return (
      <LoginComponent data={this.state}
        onClick={this.handleSubmit}
        onChange={this.handleChange}
        onForgotClick={this.handleForgotOnClick}
        onForgotSubmit ={this.handleForgotSubmit}
        onResetSubmit = {this.handleResetSubmit}/>
    );
  }
}
function mapStateToProps(state) {
  return {
      userData : state
  }
}

function mapDispatchToProps(dispatch) {
  return {
      onLogin: (config) => {
          //will dispatch the async action
          dispatch(userLogin(config))
      },
      onForgotPassword: (config) => {
        dispatch(forgotPassword(config))
      },
      onResetPassword: (config) => {
        dispatch(resetPassword(config))
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);