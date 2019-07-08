import React, {Component} from "react";
import {withStyles, Grid, TextField, Button,
    Card, IconButton, CardHeader, CardContent,
    Typography, List, ListItem, GridList,
    Switch, FormControlLabel} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';

import CustomModal from '../../components/modal/Modal';

import {formatDateTime} from '../../utils/DateFormat';
import {capitalizeFirstLetter} from '../../utils/FormatStrings';

import styles from './ProjectCreationStyle';

class ProjectLocationInfo extends Component {
    constructor(props) {
      super(props)
      this.state = {
        // expanded: 'project'
      }
    }

    render() {
        const {classes, data, onChange, onClick,
            onAddtion, handleModalState} = this.props;
        let returnData = <div>
            <Grid container spacing={24}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="name"
                        name="name"
                        label="Washroom Name"
                        fullWidth
                        value={data.location.name}
                        onChange={e=>onChange(e, 'location')}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="locn"
                        name="locn"
                        label="Washroom Location"
                        fullWidth
                        autoComplete="Washroom Location"
                        value={data.location.locn}
                        onChange={e=>onChange(e, 'location')}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="offdays"
                        name="offdays"
                        label="Off Days, seperated by ,"
                        fullWidth
                        value={data.location.offdays}
                        onChange={e=>onChange(e, 'location')}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                    label="Mute"
                    id="Mute"
                    name="Mute"
                    control={
                        <Switch
                        checked={data.location.Mute}
                        onChange={e=>onChange(e, 'location')}
                        value="Mute"
                        />}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="ShiftStart"
                        name="ShiftStart"
                        label="Shift Start"
                        type="time"
                        placeholder="HHMM"
                        fullWidth
                        autoComplete="ShiftStart"
                        value={data.location.ShiftStart}
                        onChange={e=>onChange(e, 'location')}
                        InputLabelProps={{
                            shrink: true}}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="ShiftEnd"
                        name="ShiftEnd"
                        label="Shift End"
                        type="time"
                        placeholder="HHMM"
                        fullWidth
                        autoComplete="ShiftEnd"
                        value={data.location.ShiftEnd}
                        onChange={e=>onChange(e, 'location')}
                        InputLabelProps={{
                            shrink: true
                        }}/>
                </Grid>
                {data.errorMessage &&
                    <Grid item
                        xs={24} sm={12}>
                        <Typography
                            variant="contained"
                            color="secondary"
                            >
                            {data.errorMessage}
                        </Typography>
                    </Grid>
                }
            </Grid>
        </div>
        return (
            <div className={classes.gridRoot}>
                <Grid spacing={24} className={classes.grid}>
                    <Grid item xs={24} sm={12}
                        container
                        alignItems='right'
                        direction='row'
                        justify='flex-end'>
                        <IconButton>
                            <AddCircleOutlineIcon 
                                onClick={event => handleModalState('location')}
                            />
                        </IconButton>
                    </Grid>
                </Grid>
                <GridList cellHeight={250} className={classes.gridList}>
                    {data.locations &&
                        data.locations.map((dt, i) => {
                        // Display the Added locations for the project
                        // With Edit and Delete options for the selections.
                        return <Card className={classes.card} key={i}>
                            <CardHeader
                                action={
                                <IconButton className={classes.iconButton}>
                                    <EditIcon 
                                    // onClick={event => this.editLocation(dt.InsID, dt.name)}
                                    />
                                    {/* <ClearIcon onClick={event => this.removeLocation(dt.InsID, dt.name)}/> */}
                                </IconButton>
                                }
                                title={dt.name}
                                subheader={dt.locn}/>
                                <CardContent>
                                    <Typography component="p">
                                    <b>Shift Start At :</b> {formatDateTime(dt.ShiftStart, "HHmm", "hh:mm A")}
                                    </Typography>
                                    <Typography component="p">
                                    <b>Shift Ends At :</b> {formatDateTime(dt.ShiftEnd, "HHmm", "hh:mm A")}
                                    </Typography>
                                    <Typography component="div">
                                        <b>Off Days :</b> 
                                        <List dense={true}>
                                        {dt.offdays.map((dt, index) => {
                                            return <ListItem key={index}>
                                            {capitalizeFirstLetter(dt)}
                                            </ListItem>
                                        })}
                                        </List>
                                    </Typography>
                                </CardContent>
                            </Card>
                        })
                    }
                </GridList>
                {data.limitErrorMessage &&
                    <Grid 
                        item
                        xs={24} sm={12}>
                        <Typography
                            color="secondary">
                            {data.limitErrorMessage}
                        </Typography>
                    </Grid>
                }
                <Grid container spacing={24}>
                    <Grid item xs={6} sm={3}
                        direction='row'
                        justify='flex-start'>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={e=>onClick('location', true)}
                            >
                            Draft
                        </Button>
                    </Grid>
                    <Grid item xs={16} sm={8}
                        container
                        direction='row'
                        justify='flex-end'>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={e=>onClick('general')}>
                            Previous
                        </Button>
                    </Grid>
                    <Grid item xs={2} sm={1}
                        container
                        direction='row'
                        justify='flex-end'>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={e=>onClick('area')}>
                            Next
                        </Button>
                    </Grid>
                </Grid>
                
                {/* Modal for Associating user to new location */}
                <CustomModal
                    header="Add Location Details"
                    content={returnData}
                    handleClose={event => handleModalState('location')}
                    handleClick={onAddtion}
                    open={data.open}
                    showFooter={true}
                />
            </div>
        )
    }
}
export default withStyles(styles)(ProjectLocationInfo);