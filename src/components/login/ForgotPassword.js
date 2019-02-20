import React from 'react';
import { NamespacesConsumer } from 'react-i18next';

import {Avatar, Button, FormControl,
    Input, InputLabel, Paper, Typography,
    withStyles, CircularProgress, LinearProgress} from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutlined';
import PropTypes from 'prop-types';

import styles from './LoginStyle';
import '../../sass/App.scss';

class ForgotPasswordComponent extends React.Component {
    render() {
        const { classes, onChange, onForgotSubmit, data } = this.props;
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
                        <InputLabel htmlFor="email">{t('email')}</InputLabel>
                        <Input required id="email" type="email" name="email" autoComplete="email" autoFocus
                        onChange={onChange}/>
                        </FormControl>
                        <InputLabel error>{data.errorMessage}</InputLabel>
                        <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onForgotSubmit}
                        disabled={data.disableBtn}
                        >
                        Submit
                        </Button>
                        {data.loading && 
                        // <CircularProgress size={50} className={classes.buttonProgress} />
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

ForgotPasswordComponent.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(ForgotPasswordComponent);