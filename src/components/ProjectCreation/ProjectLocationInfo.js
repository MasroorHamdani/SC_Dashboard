import React, {Component} from "react";
import {withStyles, Grid, TextField, Button,
    Card, IconButton, CardHeader, CardContent,
    Typography, List, ListItem, GridList,
    Switch, FormControlLabel, Checkbox} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';

import CustomModal from '../modal/Modal';
import EnhancedTable from '../grid/Grid';

import {SORTING, DEVICE_TYPE} from '../../constants/Constant';
import {formatDateTime} from '../../utils/DateFormat';
import {capitalizeFirstLetter} from '../../utils/FormatStrings';

import styles from './ProjectCreationStyle';

class ProjectLocationInfo extends Component {
    constructor(props) {
      super(props)
      this.state = {
        order: SORTING['DECENDING'],
        orderBy: 'name',
        selected: [],
        page: 0,
        rowsPerPage: 5,
        imageUploaded: false
      }
    }

    handleChange = (name, value) => {
    /**
     * Generic function to set the state in case of any change in any of the fields
     */
        this.setState({
            [name] : value
        });
    }

    render() {
        const {classes, data, onChange, onClick,
            onAddtion, handleModalState, editLocation,
            handleFileUpload} = this.props;
        let returnData = <div>
            {data.showFooter &&
            <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                    <input label="Upload Floor Map"
                        type="file"
                        id="fileUrl"
                        name="fileUrl"
                        onChange={handleFileUpload}
                        />
                    { data.location.fileUrl &&
                        <Typography component="p">
                            <b>Map Image:</b> {data.location.fileUrl}
                        </Typography>
                    }
                </Grid>
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
                        id="offday"
                        name="offday"
                        label="Off Days, seperated by ,"
                        fullWidth
                        value={data.location.offday}
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
                        label="Offtime Start"
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
                        label="Offtime End"
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
                <Grid item xs={true} sm={true}>
                        <List dense className={classes.flexList}>
                            {Object.keys(DEVICE_TYPE).map((key, index) => {
                                return <ListItem className={classes.listItem} key={index}>
                                        <TextField
                                            required
                                            type="number"
                                            id={key}
                                            name={key}
                                            label={DEVICE_TYPE[key]}
                                            placeholder='Device count'
                                            fullWidth
                                            value={data.location.devices_count[key]}
                                            onChange={e=>onChange(e, 'location')}
                                            InputLabelProps={{
                                                shrink: true
                                            }}/>
                                    </ListItem>
                            })}
                            
                        </List>
                </Grid>
                {data.errorMessage &&
                    <Grid item
                        xs={12} sm={12}>
                        <Typography
                            variant="contained"
                            color="secondary">
                            {data.errorMessage}
                        </Typography>
                    </Grid>
                }
            </Grid>
            }
        </div>;
        let rows = [{ id: 'name', numeric: 'left', disablePadding: false, label: 'Name' },
                    { id: 'locn', numeric: 'left', disablePadding: false, label: 'Location' },
                    { id: 'offdays', numeric: 'left', disablePadding: false, label: 'Off Days' },
                    { id: 'Mute', numeric: 'left', disablePadding: false, label: 'Mute' },
                    { id: 'offtimes', numeric: 'left', disablePadding: false, label: 'Off Times' },
                    { id: 'fileUrl', numeric: 'left', disablePadding: false, label: 'Floor Map' },
                    { id: 'devices_count', numeric: 'left', disablePadding: false, label: 'Total Devices'},
                ],
            tabData = <Typography component="div">
                {!data.showFooter &&
                    <EnhancedTable data={data.locations} rows={rows}
                        order={this.state.order}
                        orderBy={this.state.orderBy}
                        rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                        selected={this.state.selected}
                        handleChange={this.handleChange}
                        category='location'
                        redirectID="ID"/>
                }
                </Typography>
        return (<div className={classes.gridRoot}>
            {data.showFooter ?
            <div>
                <Grid spacing={16} container className={classes.grid}>
                    <Grid item xs={12} sm={12}
                        container
                        alignItems='flex-end'
                        direction='row'
                        justify='flex-end'>
                        <IconButton onClick={event => handleModalState('location')}>
                            <AddCircleOutlineIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
                <GridList cellHeight={350} className={classes.gridList}>
                    {data.locations &&
                        data.locations.map((dt, i) => {
                        // Display the Added locations for the project
                        // With Edit and Delete options for the selections.
                        return <Card className={classes.card} key={i}>
                            <CardHeader
                                action={
                                <IconButton
                                    className={classes.iconButton}
                                    onClick={event => editLocation(i)}>
                                    <EditIcon/>
                                    {/* <ClearIcon onClick={event => this.removeLocation(dt.InsID, dt.name)}/> */}
                                </IconButton>
                                }
                                title={dt.name}
                                subheader={dt.locn}/>
                                <CardContent>
                                    { dt.fileUrl &&
                                        <Typography component="p">
                                            <b>Map Image:</b> {dt.fileUrl}
                                        </Typography>
                                    }
                                    <Typography component="p">
                                        <b>Shift Start At :</b> {formatDateTime(dt.ShiftStart, "HHmm", "hh:mm A")}
                                    </Typography>
                                    <Typography component="p">
                                    <   b>Shift Ends At :</b> {formatDateTime(dt.ShiftEnd, "HHmm", "hh:mm A")}
                                    </Typography>
                                    <Typography component="div">
                                        <b>Device Count List :</b> 
                                        <div className={classes.deviceDisplay}>
                                        {Object.keys(dt.devices_count).map((key, index) => {
                                            return <Typography key={index}> {key} - { dt.devices_count[key]} <b>| </b> </Typography>
                                        })}
                                        </div>
                                    </Typography>
                                    <Typography component="div">
                                        <b>Off Days :</b>
                                        <div className={classes.deviceDisplay}>
                                            {dt.offdays.map((dt, index) => {
                                                return <Typography key={index}> {capitalizeFirstLetter(dt)} <b>| </b> </Typography>
                                            })}
                                        </div>
                                    </Typography>
                                </CardContent>
                            </Card>
                        })
                    }
                </GridList>
                {data.limitErrorMessage &&
                    <Grid 
                        item
                        xs={12} sm={12}>
                        <Typography
                            color="secondary">
                            {data.limitErrorMessage}
                        </Typography>
                    </Grid>
                }
                <Grid container spacing={24}>
                    <Grid item xs={6} sm={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={e=>onClick('location', true)}
                            >
                            Draft
                        </Button>
                    </Grid>
                    <Grid item xs={2} sm={8}
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
            :
                <div>{tabData}</div>
            }
            </div>
        )
    }
}
export default withStyles(styles)(ProjectLocationInfo);