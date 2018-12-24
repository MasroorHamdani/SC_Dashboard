import React, { Component } from 'react';
import { connect } from "react-redux";
import {withStyles, Grid, TextField, FormControlLabel,
    Switch, Button, Card, CardHeader, IconButton} from '@material-ui/core';
import {isEqual} from 'lodash';
import ClearIcon from '@material-ui/icons/Clear';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import styles from './ProjectTeamDetailsStyle';
import CustomModal from '../../components/modal/Modal';
import {API_URLS, PROJECT_TABS} from '../../constants/Constant';
import {getApiConfig} from '../../services/ApiCofig';
import {projectDetailData} from '../../actions/ProjectDataAction';

class ProjectInstallationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            pid: props.match.params.pid
        };
    }
    
    handleOpen = () => {
        this.setState({ open: true},
            function() {
                const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}/
                ${PROJECT_TABS['INSTALLATION']}/${PROJECT_TABS['DETAILS']}`,
                    config = getApiConfig(endPoint, 'GET');
                this.props.onProjectDetailData(config);
            });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    onAddtion = () => {
        console.log("Add loction to user");
        this.handleClose();
    }
    handleOnChange = () => {
        console.log("On change handler");
    };
    handleOnClick = () => {
        console.log("On Click handler");
    };
    removeLocation = (id) => {
        console.log("remove id from user list", id);
    }
    addLocation = (id) => {
        console.log("Add selected location", id);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.locationList &&
            !isEqual(this.props.locationList, prevState.locationList)) {
                console.log(this.props.locationList);
          }
      }
    
    render(){
        let returnData;
        const {classes} = this.props;
        if(this.props.locationList) {
            returnData = this.props.locationList.map((loc, id) => {
                return (
                    <Card key={id}>
                        <CardHeader
                            avatar={
                                <IconButton>
                                    <LocationCityIcon className={classes.icon}/>
                                </IconButton>
                                }
                            action={
                            <IconButton>
                                <AddCircleOutlineIcon onClick={event => this.addLocation(id)}/>
                            </IconButton>
                            }
                            title = {loc.name}
                            subheader={loc.locn}/>
                    </Card>
                )
              })
        }
        const data = {'Firstname': "Chicken",
                    "ID": "chicken1",
                    "Lastname": "Butter",
                    "Mute": false,
                    "Phoneno": "+6584970565",
                    "RFID": "86617A96",
                    "ShiftEnd": "10:00 PM",
                    "ShiftStart": "08:00 AM",
                    "AssignedTo": [
                        {site_addr: "Dubai, United Arab Emirates", site: "Dubai Mall"},
                        {site_addr: "6 CommonWealth Lane, Singapore", site: "Dubai Mall"},
                        {site_addr: "Choa Chu Kang, Singapore", site: "Choa Chu Kang Bus Interchange"}
                    ]
                }
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
                                value={data.Firstname}
                                onChange={this.handleOnChange}
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
                            onChange={this.handleOnChange}
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
                            onChange={this.handleOnChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="RFID"
                            name="RFID"
                            label="User RFID"
                            fullWidth
                            autoComplete="RFID"
                            value={data.RFID}
                            onChange={this.handleOnChange}
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
                            onChange={this.handleOnChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                            label="Mute"
                            control={
                                <Switch
                                checked={data.Mute}
                                onChange={this.handleOnChange}
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
                            onChange={this.handleOnChange}
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
                            onChange={this.handleOnChange}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card className={classes.card}>
                                <CardHeader action={
                                    <IconButton>
                                        <AddCircleOutlineIcon onClick={this.handleOpen}/>
                                    </IconButton>
                                    }
                                    subheader="Location Assigned"/>
                                {data.AssignedTo.map((dt, i) => {
                                return <Card className={classes.card} key={i}>
                                    <CardHeader
                                        action={
                                        <IconButton>
                                            <ClearIcon onClick={event => this.removeLocation(i)}/>
                                        </IconButton>
                                        }
                                        title={dt.site}
                                        subheader={dt.site_addr}/>
                                    </Card>
                                }) }
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.handleOnClick}
                            >
                            Update
                            </Button>
                        </Grid>
                    </Grid>
                    <CustomModal
                    header="Select the location"
                    content={returnData}
                    handleClose={this.handleClose}
                    handleClick={this.onAddtion}
                    open={this.state.open}
                    />
                </main>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        locationList : state.ProjectDetailsReducer.data,
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
        onProjectDetailData: (config) => {
            dispatch(projectDetailData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectInstallationDetails));