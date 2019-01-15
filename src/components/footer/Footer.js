import React, { Component } from 'react';
import {AppBar, Typography, withStyles} from '@material-ui/core';
import classNames from 'classnames';

import { NamespacesConsumer } from 'react-i18next';
import styles from './footerStyle';

/***
 * Footer Component - 
 * It is an independent component.
 * It will be part of webapp through out the site.
 */
class Footer extends Component {
  render() {
    const {classes} = this.props;
    return (
      <AppBar
        position="fixed"
        color="primary"
        className={classNames(classes.appBar)}
        >
        <NamespacesConsumer>
          {
            t=> <Typography
                component="h6"
                color="inherit"
                noWrap
                className={classes.title}>
                {t('footer-note')}
              </Typography>
          }
        </NamespacesConsumer>
      </AppBar>
    );
  }
}
export default withStyles(styles)(Footer);