import React, {Component} from 'react';
import { connect } from "react-redux";
import styles from './ProjectDetailStyle';
import {withStyles, AppBar, Tabs, Tab, Typography, Paper, Grid, TextField, CardMedia} from '@material-ui/core';
import PropTypes from 'prop-types';
import TabContainer from '../tabContainer/TabContainer';
import {PROJECT_TABS, API_URLS} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectDetailData} from '../../actions/ProjectDataAction';
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
    let url;
    if (value === 1) {
      url = 'installations';
    }
    const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.props.data.PID}/${url}`,
            config = getApiConfig(endPoint, '', 'GET');
        this.props.onProjectDetailData(config);

  };

  render() {
      const { classes, data } = this.props;
      return (
          <div className={classes.root}>
          <main className={classes.content}>
            <Paper style={{ padding: 8 * 3 }}>
              <Typography component="div">
              <img
                        className="project-image"
                        title="Project Image"
                        src={data.imurl}
                        />
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
                  <Tab label="Subscriber" />
                  <Tab label="Setting" />
                </Tabs>
              </AppBar>
              
              {this.state.value === 0 && <TabContainer data={data}  category={PROJECT_TABS['TEAM']}>Team</TabContainer>}
              {this.state.value === 1 && <TabContainer data={this.props.projectData}  category={PROJECT_TABS['INSTALLATION']}>Installation</TabContainer>}
              {this.state.value === 2 && <TabContainer data={data}  category={PROJECT_TABS['SUBSCRIBER']}>Subscriber</TabContainer>}
              {this.state.value === 3 && <TabContainer data={data}  category={PROJECT_TABS['SETTING']}>Setting</TabContainer>}
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
        onProjectDetailData: (config) => {
            //will dispatch the async action
            dispatch(projectDetailData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectDetail));