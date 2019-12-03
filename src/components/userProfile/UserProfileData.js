import React, {Component} from 'react';
import {withStyles, Grid, TextField, Button, Switch, FormControlLabel} from '@material-ui/core';
import styles from './UserProfileDataStyle';
import { NamespacesConsumer } from 'react-i18next';
import CustomModal from '../modal/Modal';

class UserProfileData extends Component {
    render() {
        const {classes, data, onChange, onClick,
            handleModalProfileState} = this.props;
        return (
            <div className={classes.root}>
            <NamespacesConsumer>
            {
            t=><main className={classes.content}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Firstname"
                                name="Firstname"
                                label={t('firstname')}
                                fullWidth
                                value={data.profile.Firstname}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            id="Lastname"
                            name="Lastname"
                            label={t('lastname')}
                            fullWidth
                            autoComplete="Lastname"
                            value={data.profile.Lastname}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            disabled
                            id="ID"
                            name="ID"
                            label={t('userid')}
                            fullWidth
                            autoComplete="ID"
                            value={data.profile.ID}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            disabled
                            id="RFID"
                            name="RFID"
                            label={t('userfid')}
                            fullWidth
                            autoComplete="RFID"
                            value={data.profile.RFID}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="Phonenum"
                            name="Phonenum"
                            label={t('phoneno')}
                            fullWidth
                            value={data.profile.Phonenum}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                            label={t('mute')}
                            id="Mute"
                            name="Mute"
                            control={
                                <Switch
                                checked={data.profile.Mute}
                                onChange={onChange}
                                value="Mute"
                                />}
                            />
                        </Grid>
                        <Grid item
                            container
                            alignItems='center'
                            direction='row'
                            justify='flex-end'>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={onClick}
                                >
                                {t('profileUpdate')}
                            </Button>
                        </Grid>
                    </Grid>
                    <CustomModal
                        header="User updated"
                        content="User Details has been updated"
                        handleClose={handleModalProfileState}
                        open={data.profileNotify}
                        showFooter={false}
                    />
                </main>
            }</NamespacesConsumer>
            </div>
        )
    }

}

export default (withStyles(styles)(UserProfileData))