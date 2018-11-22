import React, { Component } from 'react';
import { connect } from "react-redux";
import { NamespacesConsumer } from 'react-i18next';

import "../../sass/App.css";
import ProjectDataComponent from "../../components/ProjectData";
import { API_URLS, X_API_KEY, REACT_URLS } from "../../constants/Constant";
import { getApiConfig } from '../../services/ApiCofig';
import {dashboardData} from '../../actions/DashboardAction';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : {},
      redirect: false
    }
  }
  
  handleClick() {
    console.log('Click happened');
    this.props.history.push(REACT_URLS['PROJECT_DETAILS'])
  }

  componentDidMount(){
    const endPoint = API_URLS['DASHBOARD'],
          config = getApiConfig(endPoint, X_API_KEY, 'GET');
    this.props.onDashbaord(config);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.state.DashboardReducer.data) {
      const mapped_data = [],
            response_data = this.props.state.DashboardReducer.data;
      if(response_data["Item"]) {
        const projects = response_data["Item"]["Projects"]
        for (var key in projects) {
          projects[key]['key']=key;
          mapped_data.push(projects[key])
        }
      }
      // this.setState({
      //   data: mapped_data
      // })
    }
  }

  render() {
    return (
      <div className="App App-header">
      <NamespacesConsumer>
        {
          t => <h1>{t('Welcome to React')}</h1>
        }
      </NamespacesConsumer>
        <ProjectDataComponent data={this.state.data} onClick={this.handleClick.bind(this)}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      state
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