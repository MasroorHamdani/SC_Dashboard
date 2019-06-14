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
import {projectAnalysisData, projectSubMenuList,
  projectDataMetricList, InitialiseDataState,
  InitialiseMetricState} from '../../actions/DataAnalysis';
import {getVector} from '../../utils/AnalyticsDataFormat';
import {formatDateWithTimeZone, formatDateTime, getTodaysStartDateTime} from '../../utils/DateFormat';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : [],
      dashboardData : [],
      // loading: true,
      endTime: new Date(),
      startTime: getTodaysStartDateTime(),
    }
    this.metricsIndex = 0;
    this.metricLength = 0;
    this.metricsIndexReceived = 0;
  }

  getProjectData = () => {
  /**
   * Set the loading value to true to show up loading icon
   * and call the api for fetch analytics data for selected project id.
   */
    this.setState({loading: true}, function() {
      let getEndPoint = `${API_URLS['NEW_DEVICE_DATA']}/${this.state.PID}`,
        params = {
          action: 'PROJECT_HOMEPAGE'
        },
        getconfig = getApiConfig(getEndPoint, 'GET', '', params);
        this.props.onDataMetricList(getconfig);

      // let dataToPost = DASHBOARD_METRIC,
      //   endPoint = `${API_URLS['DEVICE_DATA']}/${this.state.PID}/${API_URLS['DEFAULT']}`,
      //   params = {
      //     'start' : formatDateTime(this.state.startTime, DATE_TIME_FORMAT, DATE_TIME_FORMAT),
      //     'end': formatDateWithTimeZone(this.state.endTime, DATE_TIME_FORMAT, DATE_TIME_FORMAT, this.state.timeZone),
      //   },
      //   config = getApiConfig(endPoint, 'POST', dataToPost, params);
      // this.props.onDataAnalysis(config);
    })
  }

  componentWillUnmount() {
    this.props.onInitialState();
  }

  componentDidMount() {
  /**
   * First function being called on loading.
   * It will check if state.pid is present or not, if not, it will check what is the value
   * selected in reducer for pid and call the required api using that value.
   * Time zone is also saved as part of the state. Time zone is used to change the datetime.
   */
    if(this.state.PID && this.state.timeZone) {
      this.getProjectData();
    } else if(this.props.projectSelected || localStorage.getItem('projectSelected')) {
      let dt = JSON.parse(localStorage.getItem('projectSelected'));
      this.setState({
        PID: this.props.projectSelected ? this.props.projectSelected.PID : dt.PID,
        timeZone: this.props.projectSelected ? this.props.projectSelected.Region : dt.Region
      }, function() {
          this.getProjectData();
        });
    }
  }

  getInstallationLocation = () => {
  /**
   * Make an API call and get installation location details for selected project.
   */
      const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.PID}${API_URLS['WASHROOM_LOCATION']}`,
          config = getApiConfig(endPoint, 'GET');
      this.props.onDataAnalysisMenu(config);
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
        this.metricsIndex = 0;
        this.metricsIndexReceived = 0;
        this.props.onInitialState();
        this.setState({
          PID: this.props.projectSelected.PID,
          timeZone: this.props.projectSelected.Region,
          dashboardData: []
        }, function() {
          this.getProjectData();
        });
    }
  /**
   * This part will gte the metric list for dashboard. on basis of the
   * data returned in this API call, rest of the nested call will be done
   * TO get the actaul data per metrics and shown to end user on Home screen.
   */
    if(this.props.projectMetricList &&
      !isEqual(this.props.projectMetricList, prevProps.projectMetricList)
      && this.metricsIndex === 0) {
        this.metricLength = this.props.projectMetricList ? this.props.projectMetricList.length : 0;
        if(this.metricsIndex < this.metricLength) {
          this.props.projectMetricList.map((extRow) => {
              Object.keys(extRow).map((key) => {
                extRow[key].map((row) => {
                  if(Object.values(row)[0].data_source === this.state.PID) {
                    let dataToPost = {'all_metrics' : Object.values(row)},
                      endPoint = `${API_URLS['NEW_DEVICE_DATA']}/${this.state.PID}`,
                      params = {
                        'start' : formatDateTime(this.state.startTime, DATE_TIME_FORMAT, DATE_TIME_FORMAT),
                        'end': formatDateWithTimeZone(this.state.endTime, DATE_TIME_FORMAT, DATE_TIME_FORMAT, this.state.timeZone),
                      },
                      config = getApiConfig(endPoint, 'POST', dataToPost, params);
                    this.props.onDataAnalysis(config);
                  }
                })
              })
            this.metricsIndex += 1;
          })
        }
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
    if ((this.props.dashboardData || this.props.dataAnalysis || this.props.projectLocationList) &&
      ((!isEqual(this.props.dashboardData, prevProps.dashboardData) ||
      !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis) ||
      !isEqual(this.props.projectLocationList, prevProps.projectLocationList)))) {
        let projData = [], dashboardData = [];
        if(this.props.dashboardData && this.props.dashboardData.length > 0) {
          this.props.dashboardData.map((row) => {
            if(row.NS === NAMESPACE['PROJECT_TEAM_ALLMEMBERS'])
              projData.push(row);
          });
        }
        if(this.props.dataAnalysis &&
          !isEqual(this.props.dataAnalysis, prevProps.dataAnalysis)
          || !this.state.dashboardData.length > 0) {
            let projObj = {}, metricsData={};
            const deviceResponse = this.props.dataAnalysis ? this.props.dataAnalysis.data.data : '';
            if(this.props.dataAnalysis && this.props.dataAnalysis.data.status === "success") {
              this.getInstallationLocation();
              metricsData = getVector(this.props.dataAnalysis.data.data.all_metrics, 'DASHBOARD');
              projObj['PID'] = deviceResponse.pid;
              projData.map((row) => {
                if(row.PID === deviceResponse.pid) {
                  projObj['Site'] = row.Site;
                  projObj['Site_Addr'] = row.Site_Addr;
                  projObj['dataAnalysis'] = deviceResponse;
                  projObj['metrics'] = metricsData.dataMetrics;
                  projObj['allMetrics'] = deviceResponse.all_metrics;
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
              loading: false
            });
            // if(this.metricsIndexReceived === this.metricLength) {
            //   this.setState({
            //     loading: false
            //   })
            // }
            // this.metricsIndexReceived =+1;
        }
        if(this.props.projectLocationList &&
          !isEqual(this.props.projectLocationList, prevProps.projectLocationList)) {
            this.setState({projectLocationList: this.props.projectLocationList })
        }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.content}>
        {this.state.loading &&
          (<LinearProgress className={classes.buttonProgress}/>)
        }
        {(this.state.dashboardData &&
          <div className={classes.gridRoot}>
            <GridList cellHeight={180} className={classes.gridList}>
              <ProjectDataComponent stateData={this.state}/>
            </GridList>
          </div>
        )}
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
      projectLocationList : state.DataAnalysisProjectListSubMenuReducer.data,
      projectMetricList: state.ProjectMetricListReducer.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onDataAnalysis: (config) => {
      dispatch(projectAnalysisData(config))
    },
    onDataAnalysisMenu: (config) => {
      dispatch(projectSubMenuList(config))
    },
    onDataMetricList: (config) => {
      dispatch(projectDataMetricList(config))
    },
    onInitialState: () => {
      dispatch(InitialiseDataState())
      dispatch(InitialiseMetricState())
    }
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));