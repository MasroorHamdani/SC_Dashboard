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
import '../../sass/Header.css';
import { Link} from "react-router-dom";
import {REACT_URLS} from '../../constants/Constant';

class CommonHeader extends Component {
    constructor(props) {
        super(props);
    }
    handleClick = (url) => {
        // this.props.history.push(REACT_URLS[url])
        console.log("url", REACT_URLS[url]);
    }
    render() {
        const { classes } = this.props;
        return (
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                  SmartClean
                </Typography>
                <Button color="inherit" onClick={this.handleClick('CONTACT')}>Contact Us</Button>
                <Button color="inherit">About Us</Button>
                <Button color="inherit">Login</Button>
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