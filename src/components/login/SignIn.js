import React from 'react';
import { NamespacesConsumer } from 'react-i18next';

import {Avatar, Button, FormControl, Input,
    InputLabel, Paper, Typography,
    withStyles, LinearProgress} from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutlined';
import PropTypes from 'prop-types';

import styles from './LoginStyle';
import '../../sass/App.scss';

class SignInComponent extends React.Component {
    render() {
        const { classes, onChange, onClick, data, onForgotClick } = this.props;
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
                    <Button onClick={onForgotClick} className="forgot-paswd-btn" size="small">
                    {t('forgotPassword')}
                    </Button>
                    <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">{t('password')}</InputLabel>
                    <Input name="password" type="password" id="password" autoComplete="current-password"
                    onChange={onChange}/>
                    </FormControl>
                    <InputLabel error>{data.errorMessage}</InputLabel>
                    <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={onClick}
                    disabled={data.disableBtn}
                    >
                    {t('signIn')}
                    </Button>
                    {data.loading &&
                        <LinearProgress className={classes.buttonProgress}/>
                    }
                </form>
                </Paper>
            </main>
            }
            </NamespacesConsumer>
        );
    }

}

SignInComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(SignInComponent);