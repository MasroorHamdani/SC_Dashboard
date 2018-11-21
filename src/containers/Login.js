import React from 'react';
import axios from 'axios';
import API_END_POINT from "../constants/Constant";
import LoginComponent from "./../components/Login"

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
    const url = API_END_POINT,
    endPoint = "/login-1-time",
    urlEndPoint = url + endPoint,
    data_to_post = {
      "uname": this.state.username,
      "passwd": this.state.password
    },
    self = this;
    
    axios({
      method: 'post',
      url: urlEndPoint,
      data: data_to_post,
      headers: {'Content-Type':'application/json',
                'x-api-key':'QcbUJLoJSY2Mj1IdHNgAV6BoArOS6KHa7TlL4Qgx',
                'Authorization':sessionStorage.getItem('IdToken')
              }
    })
    .then(function (response) {
      const response_data = response['data'];
      sessionStorage.setItem('RefreshToken', response_data['AuthenticationResult']['RefreshToken']);
      sessionStorage.setItem('IdToken', response_data['AuthenticationResult']['IdToken']);
      self.props.history.push("/");
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