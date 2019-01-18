import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEqual} from 'lodash-es';
import * as firebase from 'firebase';

import DispenserAnalysis from "../components/dataAnalysis/DispenserAnalysis";
import {API_URLS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {projectSubMenuList} from '../actions/DataAnalysis';
// import FirebaseData from '../services/Firebase';
// let fbObj = FirebaseData();

class DispenserDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            location: ''
        }
    }
    onCollectionUpdate = (querySnapshot) => {
        const dispenser = [];
        querySnapshot.forEach((doc) => {
            dispenser.push(doc.data());
        });
        this.setState(
            {dispenserData: dispenser})
    }
    componentDidMount() {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['PROJECT_LOCATION']}`,
            config = getApiConfig(endPoint, 'GET');
            this.props.onProjectLocation(config);
    }
    // componentDidUpdate(prevProps, prevState) {
    //     if(this.props.projectLocation &&
    //         !isEqual(this.props.projectLocation, prevProps.projectLocation)) {
    //             // console.log(this.props.projectLocation);
    //     }
    // }
    handleLocationSelectionChange = event => {
        // Either remove condition and let user select default 'Select Project' Option 
        // and make an API call with empty value
        // Or have this condotion added whcih won't user select the default empty option back.
        if(event.target.value) {
            this.setState({location: event.target.value}, function() {
                // this.fbRef = fbObj.getReference(this.state.pid, `${this.state.location}:DM`);
                // let dispenserData = this.fbRef.onSnapshot(fbObj.onCollectionUpdate);
                this.fbRef = firebase.firestore().collection(this.state.pid).doc(`${this.state.location}:DM`).collection('DATA');
                this.fbRef.onSnapshot(this.onCollectionUpdate);
                
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