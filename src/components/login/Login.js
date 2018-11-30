import React from 'react';
import { NamespacesConsumer } from 'react-i18next';

import PropTypes from 'prop-types';
import {Avatar, Button, FormControl,
  FormControlLabel, Input, InputLabel, Paper, Typography,
  Checkbox, withStyles, CircularProgress} from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutlined';

import styles from './LoginStyle';

class LoginComponent extends React.Component {
  
    render() {
      const { classes, onChange, onClick, data } = this.props;
      return (
        <NamespacesConsumer>
        {
          t=><main className={classes.main}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
              {t('signInHeader')}
              </Typography>
              <form className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="username">{t('username')}</InputLabel>
                  <Input id="username" name="username" autoComplete="username" autoFocus
                  onChange={onChange}/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">{t('password')}</InputLabel>
                  <Input name="password" type="password" id="password" autoComplete="current-password"
                  onChange={onChange}/>
                </FormControl>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label={t('forgotPassword')}
                />
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onClick}
                >
                  {t('signIn')}
                </Button>
                {data.loading && <CircularProgress size={50} className={classes.buttonProgress} />}
              </form>
            </Paper>
          </main>
        }
        </NamespacesConsumer>
        
      );
    }
}
LoginComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginComponent);