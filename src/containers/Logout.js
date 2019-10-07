import React from 'react';
import { REACT_URLS } from "../constants/Constant";

export default class Logout extends React.Component {
    componentWillMount() {
    /**
     * Clear local storage and redirect user to login screen
     */
      let footer = localStorage.getItem('footer'),
        logo = localStorage.getItem('logo'),
        partnerid = localStorage.getItem('partnerid')
      localStorage.clear();
      localStorage.setItem('footer', footer);
      localStorage.setItem('logo', logo);
      localStorage.setItem('partnerid', partnerid);
      this.props.history.push(REACT_URLS.LOGIN(this.props.match.params.partnerid));
    }
    render() {
        return null
    }
}