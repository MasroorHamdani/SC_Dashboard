import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import styles from "./CommonHeaderStyle";
import { Link} from "react-router-dom";
import {REACT_URLS} from '../../constants/Constant';

class CommonHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { classes } = this.props;
        return (
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                  SmartClean
                </Typography>
                <Button color="inherit" component={Link} to='/contact'>Contact Us</Button>
                <Button color="inherit" component={Link} to='/about'>About Us</Button>
                <Button color="inherit" component={Link} to='/login'>Login</Button>
              </Toolbar>
            </AppBar>
          </div>
        );
    }
}

CommonHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommonHeader);