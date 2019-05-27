import React, {Component} from "react";
import {withStyles, Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
import { REACT_URLS } from "../../constants/Constant";
import styles from './NoMatchStyle';

class NoMatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partnerid : (props.match.params.partnerid && 
                        props.match.params.partnerid !== 'profile' &&
                        props.match.params.partnerid !== 'project' &&
                        props.match.params.partnerid !== 'alert' &&
                        props.match.params.partnerid !== 'dispenser' &&
                        props.match.params.partnerid !== 'data' &&
                        props.match.params.partnerid !== 'report' &&
                        props.match.params.partnerid !== 'health') ? props.match.params.partnerid : ''
        }
    }
    render() {
        const { classes } = this.props;
        if (!localStorage.getItem('idToken')) {
            this.props.history.push(REACT_URLS.LOGIN(this.state.partnerid));
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