import React, { Component } from 'react';
import {AppBar, Typography, withStyles} from '@material-ui/core';
import classNames from 'classnames';

import { NamespacesConsumer } from 'react-i18next';
import styles from './footerStyle';

class Footer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {classes} = this.props;
    return (
      <AppBar
        position="fixed" color="primary"
        className={classNames(classes.appBar)}>
        <NamespacesConsumer>
          {
            t=> <Typography
                component="h1"
                variant="h6"
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