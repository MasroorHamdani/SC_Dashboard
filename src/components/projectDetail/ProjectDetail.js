import React, {Component} from 'react';
import styles from './ProjectDetailStyle';
import {withStyles, AppBar, Tabs, Tab} from '@material-ui/core';
import PropTypes from 'prop-types';
import TabContainer from '../tabContainer/TabContainer';
import {PROJECT_TABS} from '../../constants/Constant';

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
    };
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
      const { classes, data } = this.props;
      return (
          <div className={classes.root}>
          <main className={classes.content}>
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
            {this.state.value === 0 && <TabContainer data={data} category={PROJECT_TABS['TEAM']}>Team</TabContainer>}
            {this.state.value === 1 && <TabContainer data={data} category={PROJECT_TABS['INSTALLATION']}>Installation</TabContainer>}
            {this.state.value === 2 && <TabContainer data={data} category={PROJECT_TABS['SUBSCRIBER']}>Subscriber</TabContainer>}
            {this.state.value === 3 && <TabContainer data={data} category={PROJECT_TABS['SETTING']}>Setting</TabContainer>}
          </main>
        </div>
      )
  }
}
ProjectDetail.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ProjectDetail);