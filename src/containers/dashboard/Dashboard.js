import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles, GridList, CircularProgress, LinearProgress} from '@material-ui/core';
import PropTypes from 'prop-types';
import {isEqual} from "lodash";
import styles from './DashboardStyle'
import ProjectDataComponent from "../../components/projectData/ProjectData";
import { API_URLS, NAMESPACE, DASHBOARD_METRIC,
  DATE_TIME_FORMAT} from "../../constants/Constant";
import { getApiConfig } from '../../services/ApiCofig';
import {dashboardData} from '../../actions/DashboardAction';
import {projectAnalysisData} from '../../actions/DataAnalysis';
import {getVector} from '../../utils/AnalyticsDataFormat';
import {formatDateWithTimeZone} from '../../utils/DateFormat';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    // let now =  new Date();
    //   now.setHours(now.getHours()-1)
    this.state = {
      data : [],
      dashboardData : [],
      loading: false,
      success: true,
      // endTime: new Date(),
      // startTime: now,
    }
    this.metricsIndex = 0;
  }

  projectActionRedirection = (e, param) => {
    this.props.history.push(`${e.target.id}/${param}`);
  }
  componentDidMount(){
    this.setState({
      loading: true,
      success: false
    });
    const endPoint = API_URLS['DASHBOARD'],
          config = getApiConfig(endPoint, 'GET');
    this.props.onDashbaord(config);
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.dashboardData || this.props.dataAnalysis) &&
      ((!isEqual(this.props.dashboardData, prevProps.dashboardData) ||
      !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis)) ||
      !this.state.dashboardData.length > 0)) {
        let projData = [], dashboardData = [];//this.state.dashboardData;
        if(this.props.dashboardData && this.props.dashboardData.length > 0)
          this.props.dashboardData.map((row) => {
            if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS'])
              projData.push(row);
          });
        if(this.metricsIndex < projData.length) {
          let data = projData[this.metricsIndex];
          this.metricsIndex = this.metricsIndex +1;
          if(data && data.PID) {
            localStorage.setItem(data.PID, data.Region);
            // let dataToPost = DASHBOARD_METRIC,
            //   endPoint = `${API_URLS['DEVICE_DATA']}/${data.PID}/${API_URLS['DEFAULT']}`,
            //   params = {
            //     'start' : formatDateWithTimeZone(this.state.startTime, DATE_TIME_FORMAT, DATE_TIME_FORMAT, data.Region),//this.state.startTime, //'201902010000',//
            //     'end': formatDateWithTimeZone(this.state.endTime, DATE_TIME_FORMAT, DATE_TIME_FORMAT, data.Region),//this.state.endTime, //'201902142300',//
            //   },
            //   config = getApiConfig(endPoint, 'POST', dataToPost, params);
            // this.props.onDataAnalysis(config);
          }
        }
        if(this.props.dataAnalysis &&
          !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis)) {
            let projObj = {}, metricsData={};
            const deviceResponse = this.props.dataAnalysis.data.data;
            if(this.props.dataAnalysis.data.status === "success") {
              metricsData = getVector(this.props.dataAnalysis.data.data.allMetrics, 'DASHBOARD');
              projObj['PID'] = deviceResponse.pid;
              projData.map((row) => {
                if(row.PID === deviceResponse.pid) {
                  projObj['Site'] = row.Site;
                  projObj['Site_Addr'] = row.Site_Addr;
                  projObj['dataAnalysis'] = deviceResponse;
                  projObj['metrics'] = metricsData.dataMetrics;
                  projObj['allMetrics'] = deviceResponse.allMetrics;
                }
              })
            } else {
              projObj['PID'] = deviceResponse.pid;
              projData.map((row) => {
                if(row.PID === deviceResponse.pid) {
                  projObj['Site'] = row.Site;
                  projObj['Site_Addr'] = row.Site_Addr;
                  projObj['dataAnalysis'] = {};
                }
              })
            }
            dashboardData.push(projObj);
            this.setState({
              dashboardData: dashboardData,
            });
        }
    }
    if(this.state.loading) {
      this.setState({
        loading: false,
        success: true
      })
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.content}>
        {this.state.loading ? (
        // <CircularProgress size={50} className={classes.buttonProgress} />
        <LinearProgress className={classes.buttonProgress}/>
        )
        : (this.state.dashboardData &&
          <div className={classes.gridRoot}>
            <GridList cellHeight={180} className={classes.gridList}>
              <ProjectDataComponent stateData={this.state}
              projectActionRedirection={this.projectActionRedirection}/>
            </GridList>
        </div>
        )
        }
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      dashboardData : state.DashboardReducer.data,
      dataAnalysis : state.DataAnalysisReducer.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onDashbaord: (config) => {
          //will dispatch the async action
          dispatch(dashboardData(config))
      },
    // onDataAnalysis: (config) => {
    //     dispatch(projectAnalysisData(config))
    // }
  }
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));