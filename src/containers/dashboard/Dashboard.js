import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles, Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './DashboardStyle'
import ProjectDataComponent from "../../components/projectData/ProjectData";
import { API_URLS, X_API_KEY, REACT_URLS } from "../../constants/Constant";
import { getApiConfig } from '../../services/ApiCofig';
import {dashboardData} from '../../actions/DashboardAction';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : {}
    }
  }
  
  handleClick = () => {
    this.props.history.push(REACT_URLS['PROJECT_DETAILS'])
  }

  componentDidMount(){
    const endPoint = API_URLS['DASHBOARD'],
          config = getApiConfig(endPoint, X_API_KEY, 'GET');
    this.props.onDashbaord(config);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dashboardData &&
      (this.props.dashboardData !== prevProps.dashboardData)) {
        console.log(this.props.dashboardData);
      }
      console.log("outside");
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography variant="h4" gutterBottom component="h2">
            Projects
          </Typography>
          <Typography component="div" className={classes.chartContainer}>
          <ProjectDataComponent data={this.props.dashboardData} onClick={this.handleClick}/>
          </Typography>
        </main>
      </div>
    );
  }
}
function getMappedData (state) {
  if (state.DashboardReducer.data) {
    const mappedData = [],
    responseData = state.DashboardReducer.data;
    if(responseData["Item"]) {
      const projects = responseData["Item"]["Projects"]
      for (var key in projects) {
        projects[key]['key']=key;
        mappedData.push(projects[key])
      }
    }
    return mappedData;
  }
}

function mapStateToProps(state) {
  return {
      dashboardData : getMappedData(state),
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
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));