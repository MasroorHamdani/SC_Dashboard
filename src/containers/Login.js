import React from 'react';
import axios from 'axios';
import * as constants from "../constants/Constant";
import LoginComponent from "./../components/Login";

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
    const url = constants.API_END_POINT,
    endPoint = constants.API_URLS['LOGIN'],
    urlEndPoint = url + endPoint,
    data_to_post = {
      "uname": this.state.username,
      "passwd": this.state.password
    },
    self = this;
    
    axios({
      method: 'POST',
      url: urlEndPoint,
      data: data_to_post,
      headers: {'Content-Type':'application/json',
                'x-api-key': constants.X_API_KEY,
                'Authorization':sessionStorage.getItem('IdToken')
              }
    })
    .then(function (response) {
      const response_data = response['data'];
      sessionStorage.setItem('RefreshToken', response_data['AuthenticationResult']['RefreshToken']);
      sessionStorage.setItem('IdToken', response_data['AuthenticationResult']['IdToken']);
      self.props.history.push(constants.REACT_URLS['DASHBOARD']);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
    render() {
        return (
          <LoginComponent data={this.state}
            onClick={this.handleSubmit.bind(this)}
            onChange={this.handleChange.bind(this)}/>
        );
      }
}
export default Login;