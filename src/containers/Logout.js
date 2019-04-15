import React from 'react';
import { REACT_URLS } from "../constants/Constant";

export default class Logout extends React.Component {
    componentWillMount() {
    /**
     * Clear local storage and redirect user to login screen
     */
        localStorage.clear();
        this.props.history.push(REACT_URLS['LOGIN']);
      }
    render() {
        return null
    }
}