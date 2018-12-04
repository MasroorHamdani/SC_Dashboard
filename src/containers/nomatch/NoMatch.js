import React, {Component} from "react";
import {withStyles, Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
import { REACT_URLS } from "../../constants/Constant";
import styles from './NoMatchStyle';

class NoMatch extends Component {
    render() {
        const { classes } = this.props;
        if (!localStorage.getItem('idToken')) {
            this.props.history.push(REACT_URLS['LOGIN']);
            return null
        } else {
            return (
                <div className={classes.root}>
                <main className={classes.content}>
                  <Typography component="div">
                  <div>404 page not found</div>
                  </Typography>
                </main>
              </div>
            )
        }
    }
}

NoMatch.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(NoMatch);