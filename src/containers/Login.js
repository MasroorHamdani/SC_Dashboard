import React from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";
import JWTDecode from 'jwt-decode';
import _ from 'lodash';

import { API_URLS, REACT_URLS, NEW_PASSWORD_REQUIRED,
  LOGIN_STATUS, PASSWORD_REGEX} from "../constants/Constant";
import LoginComponent from "../components/login/Login";
import { getApiConfig } from '../services/ApiCofig';
import {forgotPassword} from '../actions/ForgotPasswordAction';
import {resetPassword} from '../actions/ResetPasswordAction';
import { userLogin } from "../actions/LoginAction";

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
        errorMessage: '',
        disableBtn: false,
        partnerid: props.match.params.partnerid,
    };
    this.state = this.initialState;
  }
  
  handleChange = (event) => {
  /**
   * Common method to set the state of variables from all the child pages.
   */
    const {name, value} = event.target;
    this.setState({
        [name] : value
    });
  }

  handleForgotOnClick = () => {
  /**
   * Function for handling forgot password.
   * Set the status of page to forgot,
   * as the state.status changes the render function will  be called 
   * and as per the value of the 'status' page will be rendered.
   */
    this.setState({status: LOGIN_STATUS['FORGOT'],
    errorMessage: ''
    });
  };

  handleForgotSubmit = () => {
  /**
   * On submitting the forgot password page.
   * Disable the button and make an API call.
   */
    this.setState(
    {
      success: false,
      loading: true,
      disableBtn: true
    });
    const endPoint = `${API_URLS['FORGOT_PASSWORD']}/${this.state.email}`,
        config = getApiConfig(endPoint, 'GET');
    this.props.onForgotPassword(config);
  }

  handleResetSubmit = () => {
  /**
   * On submitting the reset password page.
   * Validate if both password are there and both are same.
   * Then validate if that matches our password policy,
   * Also validate if verification code is provided or not.
   * Once all of these are validated, make an API call to update password,
   * else show user an Error.
   */
    if (this.state.confpassword === this.state.password) {
      if(this.state.password.match(PASSWORD_REGEX)) {
        if(this.state.code) {
          if (!this.state.loading) {
            this.setState(
              {
                success: false,
                loading: true,
                errorMessage: '',
                disableBtn: true
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
  /**
   * Handle login flow.
   * Disable the button and make a POST API call
   */
    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true,
          disableBtn: true
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
  /**
   * Get User details from the token passed in JWT.
   * This user data is used in Header component to be displayed.
   */
    let tokenDict = JSON.parse(token['R']), data;
    if(tokenDict && tokenDict.length >0) 
    {
      data = _.find(tokenDict, attr)
    }
    return data;
  }

  componentDidMount() {
    const endPoint = `${API_URLS['PARTNER']}${this.state.partnerid? this.state.partnerid : 'default'}${API_URLS['THEME']}`,
      config = getApiConfig(endPoint, 'GET');
        // this.props.onProjectHealth(config);
    console.log(endPoint, "endPoint");
  }
  componentDidUpdate(prevProps, prevState) {
  /**
   * Handle Login Flow
   * Once login api returns data, check for status, if status is 400,
   * validate the error that is returned and based on that show user an Error Messsage
   * Enable the submit button.
   * Incase of success status 200 - check for 'ChallengeName' in response
   * if it has value of NEW_PASSWORD_REQUIRED,
   * means user is loggin in for the first time after the account has beeen created
   * So, we have to redirect user to change the password and also add api key,
   * which is unique per user.
   * else in case everything is fine, set the local storage for idToken and refreshToken
   * get the user details calling 'getTokenData function and username as part of storage.
   * For redirection, validate if there is previous path in localstorage,
   * if yes redirect user to that page,
   * else redirect user to home screen.
   * previous path is set up in apiservice,
   * on every reqeust which is forcelogged out from there.
   * So any user who comes dirrectly to a path will save this path and once logged in will be taken to same page
   * Also on session expiration, it will be saved and on relogin, user will be on same screen.
   */
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
            disableBtn: false
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
          localStorage.getItem('previousPath') !== `${REACT_URLS['BASEURL']}/${REACT_URLS['LOGIN']}`) {
              let urlArray = localStorage.getItem('previousPath').split('/'),
                newUrl;
              if(urlArray[0] === '' && urlArray[1] === REACT_URLS['BASEURL']) {
                newUrl = urlArray.slice(2).join("/")
              }
              this.props.history.push(newUrl);
        } else {
          this.props.history.push(REACT_URLS['DASHBOARD']);
        }
      }
    }
  /**
   * Handle forgot Password flow
   * Check the status of response, in case of 400
   * validate the errror returned and show user appropriate error message.
   * In other cases, set up the status to 'reset'
   * which will show up other view to user to set up password.
   */
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
        } else {
          this.setState({ status: LOGIN_STATUS['RESET'],
          errorMessage: ''});
        }
        if (this.state.loading) {
          this.setState({
            loading: false,
            success: true,
            disableBtn: false
          });
        }
    }
  /**
   * Handle Reset Password
   * Check for status, for 400 validate the error returned and
   * show user a relavant error message.
   * for success, set the status to login,
   * and show up Login page to user.
   */
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
            disableBtn: false
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
  //will dispatch the async action
  return {
      onLogin: (config) => {
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