import React, {Component} from 'react';
import {withStyles, Grid, TextField, Button, Switch, FormControlLabel} from '@material-ui/core';
import styles from './UserProfileDataStyle';
import { NamespacesConsumer } from 'react-i18next';

class UserProfileData extends Component {
    render() {
        const {classes, data, onChange, onClick} = this.props;
        return (
            <div className={classes.root}>
            <NamespacesConsumer>
            {
            t=><main className={classes.content}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="data.Firstname"
                                name="Firstname"
                                label={t('firstname')}
                                fullWidth
                                // autoComplete="Firstname"
                                value={data.Firstname}
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
                            value={data.Lastname}
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
                            value={data.ID}
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
                            value={data.RFID}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="Phoneno"
                            name="Phoneno"
                            label={t('phoneno')}
                            fullWidth
                            value={data.Phoneno}
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
                                checked={data.Mute}
                                onChange={onChange}
                                value={data.Mute}
                                />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="ShiftStart"
                            name="ShiftStart"
                            label={t('shiftStart')}
                            fullWidth
                            autoComplete="ShiftStart"
                            value={data.ShiftStart}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="ShiftEnd"
                            name="ShiftEnd"
                            label={t('shiftEnd')}
                            fullWidth
                            autoComplete="ShiftEnd"
                            value={data.ShiftEnd}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item
                            container
                            alignItems='center'
                            direction='row'
                            justify='flex-end'
                            >
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={onClick}
                                >
                                {t('update')}
                            </Button>
                        </Grid>
                    </Grid>
                </main>
            }</NamespacesConsumer>
            </div>
        )
    }

}

export default (withStyles(styles)(UserProfileData))