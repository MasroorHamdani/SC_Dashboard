import React, {Component} from 'react';
import {withStyles, Grid, TextField, Button, Switch, FormControlLabel} from '@material-ui/core';
import styles from './UserProfileDataStyle';


class UserProfileData extends Component {
    render() {
        const {classes, data, onChange, onClick} = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="data.Firstname"
                                name="Firstname"
                                label="First name"
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
                            label="Last name"
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
                            label="User ID"
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
                            label="User RFID"
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
                            label="Phone No"
                            fullWidth
                            value={data.Phoneno}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                            label="Mute"
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
                            label="Shift Start At"
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
                            label="Shift End At"
                            fullWidth
                            autoComplete="ShiftEnd"
                            value={data.ShiftEnd}
                            onChange={onChange}
                        />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={onClick}
                            >
                            Update
                            </Button>
                        </Grid>
                    </Grid>
                </main>
            </div>
        )
    }

}

export default (withStyles(styles)(UserProfileData))