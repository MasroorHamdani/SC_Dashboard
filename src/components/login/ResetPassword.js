import React from 'react';
import { NamespacesConsumer } from 'react-i18next';

import {Avatar, Button, FormControl,
    Input, InputLabel, Paper, Typography,
    withStyles, LinearProgress} from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutlined';
import PropTypes from 'prop-types';

import styles from './LoginStyle';

class ResetPasswordComponent extends React.Component {
    render() {
        const { classes, onChange, onResetSubmit, data } = this.props;
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
                        <FormControl margin="normal" fullWidth disabled>
                        <InputLabel htmlFor="email">{t('email')}</InputLabel>
                        <Input required id="email" name="email" autoComplete="email"
                        value={data.email}/>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="code">{data.codeLabel}</InputLabel>
                        <Input required id="code" name="code" autoFocus
                        onChange={onChange}/>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">{t('password')}</InputLabel>
                        <Input required id="password" type="password" name="password" autoComplete="password"
                        onChange={onChange}/>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="confpassword">{t('confpassword')}</InputLabel>
                        <Input required id="confpassword" type="password" name="confpassword"
                        onChange={onChange}/>
                        </FormControl>
                        <InputLabel error>{data.errorMessage}</InputLabel>
                        <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onResetSubmit}
                        disabled={data.disableBtn}>
                            Submit
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

ResetPasswordComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(ResetPasswordComponent);