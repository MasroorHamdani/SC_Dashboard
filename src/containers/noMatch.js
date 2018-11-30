import React, {Component} from "react";
import { REACT_URLS } from "../constants/Constant";

class NoMatch extends Component {
    state = {
        data : ''
    }
    componentDidMount() {
        if (!localStorage.getItem('idToken')) {
            this.props.history.push(REACT_URLS['LOGIN']);
        } else {
            this.state.data = <div> 404 page not found</div>
        }
    }
    render() {
        return this.state.data;
    }
}

export default NoMatch;