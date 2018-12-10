import React, {Component} from 'react';
import { connect } from "react-redux";
import styles from './ProjectDetailStyle';
import {withStyles, AppBar, Tabs, Tab, Typography, Paper, Grid, TextField} from '@material-ui/core';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';
import TabContainer from '../tabContainer/TabContainer';
import {PROJECT_TABS, API_URLS} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectDetailData, projectTeamData} from '../../actions/ProjectDataAction';
import '../../sass/App.scss';

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
    };
  }
  
  handleChange = (event, value) => {
    this.setState({ value });
    this.callApi(value);
  };

  callApi = (value) => {
    let url;
    if (value === 0 && !this.props.projectData.ProjectTeamDataReducer.data) {
      url = PROJECT_TABS['TEAM'];
    } else if(value === 1 && !this.props.projectData.ProjectDetailsReducer.data) {
      url= `${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`;
    }
    if(url) {
      const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.props.data.PID}/${url}`,
        config = getApiConfig(endPoint, 'GET');
      this.props.onProjectDetailData(config, url);
    }
  }
  componentDidMount() {
    this.callApi(0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.projectData &&
      !isEqual(this.props.projectData.ProjectDetailsReducer, prevProps.projectData.ProjectDetailsReducer)) {
        const responseData = this.props.projectData.ProjectDetailsReducer.data;
        let insIDList = [];
        responseData.map(function (data) {
          insIDList.push(data['insid'])
        });
        console.log(insIDList, "Before local storage");
        localStorage.setItem('installationLocations', insIDList);
      }
  }

  render() {
      const { classes, data, handleClick } = this.props;
      return (
          <div className={classes.root}>
          <main className={classes.content}>
            <Paper style={{ padding: 8 * 3 }}>
              <Typography component="div">
              {/* <img
                  className="project-image"
                  alt="Project"
                  src={data.imurl}
              /> */}
              </Typography>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    disabled
                    id="pid"
                    label="PID"
                    name="pid"
                    value={data.PID}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    disabled
                    id="site"
                    label="Site"
                    name="site"
                    value={data.site}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    disabled
                    id="site_addr"
                    name="site_addr"
                    label="Site Address"
                    value={data.site_addr}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <AppBar position="static" color="default">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                >
                  <Tab label="Team" />
                  <Tab label="Installation" />
                </Tabs>
              </AppBar>
              
              {this.state.value === 0 && <TabContainer data={this.props.projectData}
                category={PROJECT_TABS['TEAM']}
                handleClick={handleClick}>Team</TabContainer>}
              {this.state.value === 1 && <TabContainer data={this.props.projectData}
                category={PROJECT_TABS['INSTALLATION']}
                handleClick={handleClick}>Installation</TabContainer>}
            </Paper>
          </main>
        </div>
      )
  }
}
ProjectDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
      projectData : state,
  }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectDetailData: (config, url) => {
            //will dispatch the async action
            if(url === `${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`)
              dispatch(projectDetailData(config))
            else if(url === PROJECT_TABS['TEAM'])
              dispatch(projectTeamData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectDetail));