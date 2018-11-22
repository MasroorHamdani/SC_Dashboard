import React from 'react';
import { connect } from "react-redux";

import { API_URLS, X_API_KEY, REACT_URLS } from "../../constants/Constant";
import LoginComponent from "../../components/Login";
import { userLogin } from "../../actions/LoginAction";
import { getApiConfig } from '../../services/ApiCofig';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
        username: 'Username',
        password: 'Password'
    };
    this.state = this.initialState;
  }
  
  handleChange = event => {
    const {name, value} = event.target;

    this.setState({
        [name] : value
    });
  }

  handleSubmit() {
    const endPoint = API_URLS['LOGIN'],
          dataToPost = {
          "uname": this.state.username,
          "passwd": this.state.password
        },
        config = getApiConfig(endPoint, X_API_KEY, 'POST', dataToPost);
    this.props.onLogin(config);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.state.LoginReducer.data) {
      const response_data = this.props.state.LoginReducer.data;
      sessionStorage.setItem('RefreshToken', response_data['AuthenticationResult']['RefreshToken']);
      sessionStorage.setItem('IdToken', response_data['AuthenticationResult']['IdToken']);
      this.props.history.push(REACT_URLS['DASHBOARD']);
    }
  }
  render() {
      return (
        <LoginComponent data={this.state}
          onClick={this.handleSubmit.bind(this)}
          onChange={this.handleChange.bind(this)}/>
      );
    }
}
function mapStateToProps(state) {
  return {
      state
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