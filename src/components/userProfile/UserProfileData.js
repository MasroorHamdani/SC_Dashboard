import React, {Component} from 'react';
import {withStyles, Grid, TextField, Button, Switch, FormControlLabel} from '@material-ui/core';
import styles from './UserProfileDataStyle';
import { NamespacesConsumer } from 'react-i18next';

class UserProfileData extends Component {
    render() {
        const {classes, data, onChange, onClick} = this.props;
        console.log(data);
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
                            id="Phonenum"
                            name="Phonenum"
                            label={t('phoneno')}
                            fullWidth
                            value={data.Phonenum}
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
                                value="Mute"
                                />}
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