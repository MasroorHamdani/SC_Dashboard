import React from 'react';
import { NamespacesConsumer } from 'react-i18next';

import PropTypes from 'prop-types';
import {Avatar, Button, FormControl,
  FormControlLabel, Input, InputLabel, Paper, Typography,
  Checkbox, withStyles, CircularProgress} from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutlined';
import CustomizedProgress from '../progress/Progress';

import styles from './LoginStyle';

class LoginComponent extends React.Component {
  
    render() {
      const { classes, onChange, onClick, data } = this.props;
      return (
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input id="username" name="username" autoComplete="username" autoFocus
                onChange={onChange}/>
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input name="password" type="password" id="password" autoComplete="current-password"
                onChange={onChange}/>
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Forgot Password"
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onClick}
              >
                Sign in
              </Button>
              {data.loading && <CircularProgress size={50} className={classes.buttonProgress} />}
              {/* {data.loading && <CircularProgress size={50} className={classes.buttonProgress} />} */}
            </form>
          </Paper>
        </main>
      );
    }
}
LoginComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginComponent);