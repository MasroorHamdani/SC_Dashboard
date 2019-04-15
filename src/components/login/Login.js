import React from 'react';

import SignInComponent from './SignIn';
import ForgotPasswordComponent from './ForgotPassword';
import ResetPasswordComponent from './ResetPassword';
import {LOGIN_STATUS} from '../../constants/Constant';

class LoginComponent extends React.Component {
  
    render() {
      const { onChange, onClick, data, onForgotClick, onForgotSubmit, onResetSubmit } = this.props;
    /**
     * Depending on status value, show revalant vie wto user
     */
      if (data.status === LOGIN_STATUS['LOGIN']) {
        return (
          <SignInComponent data={data} onClick={onClick} onForgotClick={onForgotClick} onChange={onChange}/>
        );
      } else if(data.status === LOGIN_STATUS['FORGOT']) {
        return(
          <ForgotPasswordComponent onForgotSubmit={onForgotSubmit} onChange={onChange} data={data}/>
        )
      } else if(data.status === LOGIN_STATUS['RESET'])
      return(
        <ResetPasswordComponent onResetSubmit={onResetSubmit} onChange={onChange} data={data}/>
      )
    }
}

export default LoginComponent;