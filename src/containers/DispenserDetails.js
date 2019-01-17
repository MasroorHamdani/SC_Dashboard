import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEqual} from 'lodash-es';

import DispenserAnalysis from "../components/dataAnalysis/DispenserAnalysis";
import {API_URLS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {projectSubMenuList} from '../actions/DataAnalysis';

class DispenserDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            location: ''
        }
    }
    componentDidMount() {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['PROJECT_LOCATION']}`,
            config = getApiConfig(endPoint, 'GET');
            this.props.onProjectLocation(config);
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectLocation &&
            !isEqual(this.props.projectLocation, prevProps.projectLocation)) {
                console.log(this.props.projectLocation);
        }
    }
    handleLocationSelectionChange = event => {
        // Either remove condition and let user select default 'Select Project' Option 
        // and make an API call with empty value
        // Or have this condotion added whcih won't user select the default empty option back.
        if(event.target.value) {
            this.setState({location: event.target.value}, function() {
                console.log("Get dispenser data", this.state.pid, this.state.location);
                // this.ref = firebase.firestore().collection(this.state.pid).doc(`${this.state.location}:DM`).collection('DATA');
            });
        }
    };
    render() {
        return(
            <DispenserAnalysis data={this.props.projectLocation}
                stateData={this.state}
                handleLocationSelectionChange={this.handleLocationSelectionChange}/>
        )
    }
}
function mapStateToProps(state) {
    // console.log(state.DataAnalysisProjectListReducer);
    return {
        projectLocation : state.DataAnalysisProjectListSubMenuReducer.data,
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        onProjectLocation: (config) => {
          dispatch(projectSubMenuList(config))
      },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DispenserDetails);