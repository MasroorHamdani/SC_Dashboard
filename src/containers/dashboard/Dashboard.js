import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles, Typography, GridList, CircularProgress} from '@material-ui/core';
import PropTypes from 'prop-types';
import {isEqual} from "lodash";
import styles from './DashboardStyle'
import ProjectDataComponent from "../../components/projectData/ProjectData";
import { API_URLS, REACT_URLS } from "../../constants/Constant";
import { getApiConfig } from '../../services/ApiCofig';
import {dashboardData} from '../../actions/DashboardAction';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : {},
      loading: true,
      success: false,
    }
  }

  handleClick = (e, param) => {
    this.props.history.push(`${REACT_URLS['PROJECT_DETAILS']}/${param}`);
  }

  componentDidMount(){
    const endPoint = API_URLS['DASHBOARD'],
          config = getApiConfig(endPoint, 'GET');
    this.props.onDashbaord(config);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dashboardData &&
      !isEqual(this.props.dashboardData, prevProps.dashboardData)) {
        // console.log(this.props.dashboardData);
      }
      if (this.state.loading) {
        this.setState({
          loading: false,
          success: true,
        });
      }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.content}>
        {this.state.loading ? (<CircularProgress size={50} className={classes.buttonProgress} />)
        :
        (<div>
          <Typography variant="h4" gutterBottom component="h2">
            Projects
          </Typography>
          <div className={classes.gridRoot}>
            <GridList cellHeight={180} className={classes.gridList}>
              <ProjectDataComponent data={this.props.dashboardData} onClick={this.handleClick}/>
            </GridList>
          </div>
        </div>)
        }
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      dashboardData : state.DashboardReducer.data,
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