import React from 'react';
import { connect } from "react-redux";
import {isEqual} from "lodash";
import JWTDecode from 'jwt-decode';
import { API_URLS, REACT_URLS, NEW_PASSWORD_REQUIRED,
  LOGIN_STATUS } from "../constants/Constant";
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
  if (this.props.userData.LoginReducer.data
    && !isEqual(this.props.userData.LoginReducer, prevProps.userData.LoginReducer)) {
    const responseData = this.props.userData.LoginReducer.data;
    if (responseData['status'] === 400) {
      this.setState({
        errorMessage: responseData['message']
      });
      if (this.state.loading) {
        this.setState({
          loading: false,
          success: true,
        });
      }
    } else if (responseData['ChallengeName'] === NEW_PASSWORD_REQUIRED) {
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
      this.setState({ status: LOGIN_STATUS['LOGIN'] })
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