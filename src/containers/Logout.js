import React from 'react';
import { REACT_URLS } from "../constants/Constant";

export default class Logout extends React.Component {
    render() {
        localStorage.clear();
        window.location = REACT_URLS['LOGIN'];
        // this.props.history.push(REACT_URLS['LOGIN']);
        return (
            <div></div>
        )
    }
}