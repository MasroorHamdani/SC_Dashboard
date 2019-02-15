import React from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";
import JWTDecode from 'jwt-decode';
import { API_URLS, REACT_URLS, NEW_PASSWORD_REQUIRED,
  LOGIN_STATUS, PASSWORD_REGEX} from "../constants/Constant";
import LoginComponent from "../components/login/Login";
import { userLogin } from "../actions/LoginAction";
import { getApiConfig } from '../services/ApiCofig';
import {forgotPassword} from '../actions/ForgotPasswordAction';
import {resetPassword} from '../actions/ResetPasswordAction';
import _ from 'lodash';

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
        code: '',
        codeLabel: "Enter Verification code Sent to your Email",
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
    const endPoint = `${API_URLS['FORGOT_PASSWORD']}/${this.state.email}`,
        config = getApiConfig(endPoint, 'GET');
    this.props.onForgotPassword(config);
  }
  handleResetSubmit = () => {
    if (this.state.confpassword === this.state.password) {
      if(this.state.password.match(PASSWORD_REGEX)) {
        if(this.state.code) {
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
              "code": this.state.code,
              "passwd": this.state.password
            },
            config = getApiConfig(endPoint, 'POST', dataToPost);
            this.props.onResetPassword(config);
          }
        } else {
          this.setState({
            errorMessage: "Provide Verification code"
          });
        }
      } else {
        this.setState({
          errorMessage: "Password Must contain: \n 1 Uppercase\n 1 Lowercase\n 1 Numeric\n 1 Special character\n with  Length of 8-12 characters"
        });
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
      config = getApiConfig(endPoint, 'POST', dataToPost);
  this.props.onLogin(config);
    }
}
getTokenData = (token, attr) => {
  let tokenDict = JSON.parse(token['R']), data;
  if(tokenDict && tokenDict.length >0) 
  {
    data = _.find(tokenDict, attr)
  }
  return data;
}
componentDidUpdate(prevProps, prevState) {
  if (this.props.userLogin
    && !isEqual(this.props.userLogin, prevProps.userLogin)) {
    const responseData = this.props.userLogin;
    if (responseData['status'] === 400) {
      if(responseData['data'].includes('UserNotFoundException'))
        this.setState({
          errorMessage: 'User Does not Exist'
        });
      else if(responseData['data'].includes('NotAuthorizedException'))
        this.setState({
          errorMessage: 'Incorrect username or password'
        });
      if (this.state.loading) {
        this.setState({
          loading: false,
          success: true,
        });
      }
    } else if (responseData['ChallengeName'] === NEW_PASSWORD_REQUIRED) {
      this.setState({
        errorMessage: ''
      });
      localStorage.setItem('session', responseData['Session']);
      localStorage.setItem('username', this.state.username);
      this.props.history.push(REACT_URLS['AUTH_RESET']);
    } else {
      localStorage.setItem('idToken', responseData['AuthenticationResult']['IdToken']);
      localStorage.setItem('refreshToken', responseData['AuthenticationResult']['RefreshToken']);
      let idTokenDecoded = JWTDecode(responseData['AuthenticationResult']['IdToken']),
        userData = this.getTokenData(idTokenDecoded, "Firstname");
      if (userData)
        localStorage.setItem('userName', userData['SUB2']);
      if (this.state.loading) {
        this.setState({
          loading: false,
          success: true,
        });
      }
      if(localStorage.getItem('previousPath') && 
        localStorage.getItem('previousPath') !== REACT_URLS['LOGIN']) {
        this.props.history.push(localStorage.getItem('previousPath'));
      } else {
        this.props.history.push(REACT_URLS['DASHBOARD']);
      }
    }
  }
  if (this.props.forgotPassword
    && !isEqual(this.props.forgotPassword, prevProps.forgotPassword)) {
      let responseData = this.props.forgotPassword;
      if (responseData['status'] === 400) {
        if(responseData['data'].includes('LimitExceededException'))
          this.setState({
            errorMessage: 'Attempt limit exceeded, please try after some time'
          });
        if(responseData['data'].includes('NotAuthorizedException'))
          this.setState({
            errorMessage: 'User password cannot be reset! please contact system Admin'
          });
        if(responseData['data'].includes('UserNotFoundException'))
          this.setState({
            errorMessage: 'User not found'
          });
        if (this.state.loading) {
          this.setState({
            loading: false,
            success: true,
          });
        }
      } else {
        this.setState({ status: LOGIN_STATUS['RESET'],
        errorMessage: ''});
      }
  }
  if (this.props.resetPassword
    && !isEqual(this.props.resetPassword, prevProps.resetPassword)) {
      let responseData = this.props.resetPassword;
      if (responseData['status'] === 400) {
        if(responseData['data'].includes('CodeMismatchException'))
          this.setState({
            errorMessage: 'Please enter valid verification Code'
          });
      } else {
        this.setState({ status: LOGIN_STATUS['LOGIN'],
        errorMessage: ''})
      }
      if (this.state.loading) {
        this.setState({
          loading: false,
          success: true,
        });
      }
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
      userLogin : state.LoginReducer.data,
      forgotPassword: state.ForgotPasswordReducer.data,
      resetPassword : state.ResetPasswordReducer.data
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