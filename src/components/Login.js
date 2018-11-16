import React from 'react';
import Cookies from 'universal-cookie';
// import { connect } from 'react-redux';

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
   const url= "https://1w5tcso1ol.execute-api.ap-southeast-1.amazonaws.com/alpha",
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
     const cookies = new Cookies();
     cookies.set('RefreshToken', data['AuthenticationResult']['RefreshToken']);
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