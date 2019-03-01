import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles, GridList, LinearProgress} from '@material-ui/core';
import PropTypes from 'prop-types';
import {isEqual} from "lodash";
import styles from './DashboardStyle'
import ProjectDataComponent from "../../components/projectData/ProjectData";
import { API_URLS, NAMESPACE, DASHBOARD_METRIC,
  DATE_TIME_FORMAT} from "../../constants/Constant";
import { getApiConfig } from '../../services/ApiCofig';
import {projectAnalysisData} from '../../actions/DataAnalysis';
import {getVector} from '../../utils/AnalyticsDataFormat';
import {formatDateWithTimeZone} from '../../utils/DateFormat';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    let now =  new Date();
      now.setHours(now.getHours()-1)
    this.state = {
      data : [],
      dashboardData : [],
      loading: true,
      success: false,
      endTime: new Date(),
      startTime: now,
    }
    this.metricsIndex = 0;
  }

  getProjectData = () => {
    let dataToPost = DASHBOARD_METRIC,
      endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.PID}/${API_URLS['DEFAULT']}`,
      params = {
        'start' : formatDateWithTimeZone(this.state.startTime, DATE_TIME_FORMAT, DATE_TIME_FORMAT, this.state.timeZone),
        'end': formatDateWithTimeZone(this.state.endTime, DATE_TIME_FORMAT, DATE_TIME_FORMAT, this.state.timeZone),
      },
      config = getApiConfig(endPoint, 'POST', dataToPost, params);
    this.props.onDataAnalysis(config);
  }
  componentDidMount(){
  /**
   * First function being called on loading.
   * It will check if state.pid is present or not, if not, it will check what is the value
   * selected in reducer for pid and call the required api using that value.
   * Time zone is also saved as part of the state. Time zone is used to change the datetime.
   */
    if(this.state.PID && this.state.timeZone) {
      this.getProjectData();
    } else if(this.props.projectSelected) {
      this.setState({
        PID: this.props.projectSelected.PID,
        timeZone: this.props.projectSelected.Region},
        function() {
          this.getProjectData();
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
  /**
   * This function is called whenever component update.
   * we need to check if reducer got value and if current value is different the old,
   * then only we should proceed.
   */
  /**
   * This part will listen to project selection change from the header component.
   * On any change this will be called and the data will be changed in UI.
   * Also this will be the check which will get the selected project details
   * and save in internal state for further usage.
   * Reducer used - 'projectSelectReducer'
   */
    if(this.props.projectSelected &&
      !isEqual(this.props.projectSelected, prevProps.projectSelected)) {
        this.setState({
          PID: this.props.projectSelected.PID,
          timeZone: this.props.projectSelected.Region}, function() {
          this.getProjectData();
        });
    }
  /**
   * This part will get the dashboard data per project.
   * As the api will gte all the relavant data for project,
   * therefore the first thing is to filter out the data based on NameSpace.
   * Next get the data in appropriate format and pass on to other functions.
   * Reducer used to get all project details is - 'DashboardReducer'
   * this data is used to mix with analutics and get the data in representable form
   * Reducer to get Analytics data for project - 'DataAnalysisReducer'
   */
    if ((this.props.dashboardData || this.props.dataAnalysis) &&
      ((!isEqual(this.props.dashboardData, prevProps.dashboardData) ||
      !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis)) ||
      !this.state.dashboardData.length > 0)) {
        let projData = [], dashboardData = [];
        if(this.props.dashboardData && this.props.dashboardData.length > 0){
          this.props.dashboardData.map((row) => {
            if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS'])
              projData.push(row);
          });
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
            if(this.state.loading) {
              this.setState({
                loading: false,
                success: true
              })
            }
        }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.content}>
        {this.state.loading ? (
        <LinearProgress className={classes.buttonProgress}/>
        )
        : (this.state.dashboardData &&
          <div className={classes.gridRoot}>
            <GridList cellHeight={180} className={classes.gridList}>
              <ProjectDataComponent stateData={this.state}/>
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
      dataAnalysis : state.DataAnalysisReducer.data,
      projectSelected : state.projectSelectReducer.data,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onDataAnalysis: (config) => {
        dispatch(projectAnalysisData(config))
    }
  }
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));