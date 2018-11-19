import React from 'react';
// import { connect } from 'react-redux';
import API_END_POINT from "./../constants/Constant";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
        username: 'Username',
        password: 'Password',
        authenticated: false
    };

    this.state = this.initialState;
  }
  
  handleChange = event => {
    const {name, value} = event.target;

    this.setState({
        [name] : value
    });
  }

  handleSubmit = event => {
   const url = API_END_POINT,
   endPoint = "/login-1-time",
   urlEndPoint = url + endPoint,
   data_to_post = {
    "uname": this.state.username,
    "passwd": this.state.password
   };
   fetch(urlEndPoint, {
    method: 'post',
    headers: {'Content-Type':'application/json',
    'x-api-key':'QcbUJLoJSY2Mj1IdHNgAV6BoArOS6KHa7TlL4Qgx'
    },
    body: JSON.stringify(data_to_post)
   }).then(result => {
    return result.json();
   }).then(data => {
     sessionStorage.setItem('RefreshToken', data['AuthenticationResult']['RefreshToken']);
     sessionStorage.setItem('IdToken', data['AuthenticationResult']['IdToken']);
     this.props.history.push("/");
   }).catch(err => {
     console.log(err)
    });
  }
    render() {
      const {username, password} = this.state;
        return (
          <div className="auth-page">
            <div className="container page">
              <div className="row">
    
                <div className="col-md-6 offset-md-3 col-xs-12">
                  <h1 className="text-xs-center">Sign In</h1>
    
                  <form>
                    <fieldset>
    
                      <fieldset className="form-group">
                        <input
                          className="form-control form-control-lg"
                          type="text"
                          placeholder="UserName"
                          name="username"
                          value={username}
                          onChange={this.handleChange} />
                      </fieldset>
    
                      <fieldset className="form-group">
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={password}
                          onChange={this.handleChange} />
                      </fieldset>
                      <input
                        className="btn btn-lg btn-primary pull-xs-right"
                        type="button"
                        value="Sign in"
                        onClick={this.handleSubmit}
                      />
                    </fieldset>
                  </form>
                </div>
    
              </div>
            </div>
          </div>
        );
      }
}
export default Login;

// export default connect(mapStateToProps, mapDispatchToProps)(Login);