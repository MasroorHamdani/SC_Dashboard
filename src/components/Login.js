import React from 'react';
import { NamespacesConsumer } from 'react-i18next';
import "./../sass/App.css";
class LoginComponent extends React.Component {
    render() {
      const {username, password} = "this.props;"
        return (
          <div className="auth-page">
          
            <div className="container page">
              <div className="row">
                <NamespacesConsumer>{
                  t => <div className="col-md-6 offset-md-3 col-xs-12">
                    <h1 className="text-xs-center">{t('signin')}</h1>
                    <form>
                      <fieldset>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={t('username')}
                            name="username"
                            value={username}
                            onChange={this.props.onChange}
                            />
                        </fieldset>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-lg"
                            type="password"
                            placeholder={t('password')}
                            name="password"
                            value={password}
                            onChange={this.props.onChange}
                            />
                        </fieldset>
                        <input
                          className="btn btn-lg btn-primary pull-xs-right"
                          type="button"
                          value={t('signin')}
                          onClick={this.props.onClick}
                        />
                      </fieldset>
                    </form>
                  </div>
                }</NamespacesConsumer>
              </div>
            </div>
          </div>
        );
      }
}
export default LoginComponent;