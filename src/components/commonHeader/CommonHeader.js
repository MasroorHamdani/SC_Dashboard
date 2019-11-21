import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from "./CommonHeaderStyle";
import { Link} from "react-router-dom";
import { NamespacesConsumer } from 'react-i18next';

import {SC_LOGO} from '../../constants/Constant';

/**
 * This component is for the generic header which will be used
 * through out the website when user is not authenticated
 */
class CommonHeader extends Component {
    render() {
        const { classes } = this.props;
        return (
          <NamespacesConsumer>
            {
              t=><div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                  <Toolbar>
                    <Typography variant="h6" className={classes.grow}>
                    <img src={localStorage.getItem('logo') ? localStorage.getItem('logo') : {SC_LOGO}} alt="logo" className={classes.logo}/>
                    </Typography>
                    {/* <Button color="inherit" component={Link} to='/contact'>{t('Contact')}</Button>
                    <Button color="inherit" component={Link} to='/about'>{t('About')}</Button>
                    <Button color="inherit" component={Link} to='/login'>{t('signIn')}</Button> */}
                  </Toolbar>
                </AppBar>
              </div>
            }
          </NamespacesConsumer>
          
        );
    }
}

CommonHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommonHeader);