import React, { Component } from 'react';
import { connect } from "react-redux";

import "../sass/App.css";
import ProjectDataComponent from "../components/ProjectData";
import { API_URLS, X_API_KEY, REACT_URLS } from "../constants/Constant";
import { getApiConfig } from '../services/ApiCofig';
import {dashboardData} from '../actions/DashboardAction';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : {}
    }
  }
  
  handleClick() {
    this.props.history.push(REACT_URLS['PROJECT_DETAILS'])
  }

  componentDidMount(){
    const endPoint = API_URLS['DASHBOARD'],
          config = getApiConfig(endPoint, X_API_KEY, 'GET');
    this.props.onDashbaord(config);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.state);
  }

  render() {
    return (
      <div className="App App-header">
        <ProjectDataComponent data={this.props.state} onClick={this.handleClick.bind(this)}/>
      </div>
    );
  }
}
function getMappedData (state) {
  if (state.DashboardReducer.data) {
    const mapped_data = [],
          response_data = state.DashboardReducer.data;
    if(response_data["Item"]) {
      const projects = response_data["Item"]["Projects"]
      for (var key in projects) {
        projects[key]['key']=key;
        mapped_data.push(projects[key])
      }
    }
    return mapped_data;
  }
}

function mapStateToProps(state) {
  return {
      state : getMappedData(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onDashbaord: (config) => {
          //will dispatch the async action
          dispatch(dashboardData(config))
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);