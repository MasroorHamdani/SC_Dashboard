import React from 'react';
import { NamespacesConsumer } from 'react-i18next';
import "./../sass/Login.css";

class LoginComponent extends React.Component {
  
  state = {
    usernameCss: '',
    passwordCss: ''
  }
    render() {
      const props = this.props;
      return(
        <NamespacesConsumer>{
        t=><div className="container-box-login">
            <div className="box-border">
                <div>
                  <div className="row">
                    <div className="login-header">
                    
                      <form className="login-form-resp dosis-semibold login-form-boundary login-form-resp-login">
                        <div className="login-div">
                          <div className="group group-login">
                            <div className="email-field">
                              <input type="text" name="username"
                              className={this.state.usernameCss} value={props.username}
                              onClick={this.setClass.bind(this, 'usernameCss')} onChange={props.onChange}/>
                              <span className="highlight"></span><span className="bar"></span>
                              <label>{t('username')}</label>
                            </div>
                          </div>
                          <div className="group group-login">
                            <div className="password-field">
                              <input type="password" name="password" value={props.password}
                              className={this.state.passwordCss}
                              onChange={props.onChange}
                              onClick={this.setClass.bind(this, 'passwordCss')}/><span className="highlight"></span>
                              <span className="bar"></span>
                              <label>{t('password')}</label>
                            </div>
                          </div>
                          <div className="get-full-width-login">
                          <div>
                            <button type="button" className="btn btn-success login-bttn-login button buttonBlue"
                            onClick={props.onClick}>{t('signin')}
                              <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
                            </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
              </div>
            </div>
        </div>
        }</NamespacesConsumer>
        );
      }
      setClass = (value) => {
        this.setState({[value]: "used" });
      };
}
export default LoginComponent;