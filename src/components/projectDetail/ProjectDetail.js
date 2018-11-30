import React, {Component} from 'react';
import styles from './ProjectDetailStyle';
import {withStyles, Typography} from '@material-ui/core';
import PropTypes from 'prop-types';

class ProjectDetail extends Component {

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
            <main className={classes.content}>
              <Typography component="div">
              <div>Welcome to Project details Page</div>
              </Typography>
            </main>
          </div>
        )
    }
}
ProjectDetail.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ProjectDetail);