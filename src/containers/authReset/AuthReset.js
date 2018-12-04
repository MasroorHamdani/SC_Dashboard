import React, {Component} from 'react';
import ResetPasswordComponent from '../../components/login/ResetPassword';

class AuthReset extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            vercode: '',
            password: 'Password',
            confpassword: 'Password',
            email: 'Email',
            loading: false,
            vercodeLabel: "Enter code sent tou your email ID",
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
    handleSubmit = () => {
        if (this.state.confpassword === this.state.password) {
            if (!this.state.loading) {
                console.log("testing");
                this.setState({
                    errorMessage: ''
                })
            //   const endPoint = API_URLS['LOGIN'],
            //         dataToPost = {
            //         "uname": this.state.username,
            //         "passwd": this.state.password
            //       },
            //       config = getApiConfig(endPoint, X_API_KEY, 'POST', dataToPost);
            //   this.props.onLogin(config);
            //     }
            }
        } else {
            this.setState({
              errorMessage: "Password and Confirm Password should be same"
            });
        }
    }

    render() {
        return(
            <ResetPasswordComponent onResetSubmit={this.handleSubmit} onChange={this.handleChange} data={this.state}/>
        )
    }
}

export default AuthReset;