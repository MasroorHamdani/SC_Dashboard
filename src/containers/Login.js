import React from 'react';
import { connect } from "react-redux";

import { API_URLS, X_API_KEY, REACT_URLS } from "../constants/Constant";
import LoginComponent from "../components/Login";
import { userLogin } from "../actions/LoginAction";
import { getApiConfig } from '../services/ApiCofig';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
        username: 'Username',
        password: 'Password'
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
    const endPoint = API_URLS['LOGIN'],
          dataToPost = {
          "uname": this.state.username,
          "passwd": this.state.password
        },
        config = getApiConfig(endPoint, X_API_KEY, 'POST', dataToPost);
    this.props.onLogin(config);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.userData.LoginReducer.data
      && this.props.userData.LoginReducer !== prevProps.userData.LoginReducer) {
      const response_data = this.props.userData.LoginReducer.data;
      localStorage.setItem('IdToken', response_data['AuthenticationResult']['IdToken']);
      localStorage.setItem('RefreshToken', response_data['AuthenticationResult']['RefreshToken']);
      // this.props.history.push(REACT_URLS['DASHBOARD']);
      window.location = REACT_URLS['DASHBOARD'];
    }
  }
  render() {
      return (
        <LoginComponent data={this.state}
          onClick={this.handleSubmit}
          onChange={this.handleChange}/>
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
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);