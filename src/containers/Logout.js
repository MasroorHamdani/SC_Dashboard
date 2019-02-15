import React from 'react';
import { REACT_URLS } from "../constants/Constant";

export default class Logout extends React.Component {
    componentWillMount() {
        localStorage.clear();
        // localStorage.removeItem('idToken');
        // localStorage.removeItem('refreshToken');
        this.props.history.push(REACT_URLS['LOGIN']);
      }
    render() {
        return null
    }
}