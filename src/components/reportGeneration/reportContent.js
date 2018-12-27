import React, { Component } from 'react';
import {withStyles, Card, CardHeader, Avatar,
    IconButton, GridList, Checkbox, Button,
    FormControl, InputLabel, NativeSelect,
    FormHelperText, Input, Grid, CardActions,
    Collapse, CardContent, ListItem, ListItemText,
    ListItemSecondaryAction, List, GridListTile, GridListTileBar,
    ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails} from '@material-ui/core';
// import {GridTile} from 'material-ui/GridList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import {REPORT_TABS, SERVICES} from '../../constants/Constant';
import styles from './ReportGenerationStyle';

class ReportContent extends Component {
    state = { };
    
    render() {
        const {type, classes, data, stateData,
            handleProjectSelectionChange, handleExpandClick,
            handleDeviceToggle, onNextClick, onPreviousClick,
            handleServiceToggle} = this.props;
        return(
            <div>
                {type === REPORT_TABS['LOCATION'] &&
                    <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="project-native-label-placeholder">
                                Project List
                            </InputLabel>
                            <NativeSelect
                                value={stateData.project}
                                onChange={handleProjectSelectionChange}
                                input={<Input name="project" id="project-native-label-placeholder" />}>
                                <option value='' key='project' id='project'>Choose Project</option>
                                { (data.DashboardReducer.data && data.DashboardReducer.data.Projects) &&
                                    data.DashboardReducer.data.Projects.map(function(dt) {
                                        return <option value={dt.pid} key={dt.pid}>{dt.name}</option>
                                    })
                                }
                            </NativeSelect>
                            <FormHelperText>Please Select a Project for Report generationr</FormHelperText>
                        </FormControl>
                        {data.ProjectDetailsReducer.data &&
                            // <div className={classnames(classes.gridRoot, classes.gridList)}>
                            <div>
                                {data.ProjectDetailsReducer.data.map((row, index) => {
                                    return <ExpansionPanel key={index}>
                                    <ExpansionPanelSummary
                                        onClick={event => handleExpandClick(index, row.insid, row.PID)}
                                        expandIcon={<ExpandMoreIcon/>}>
                                        <div className={classes.column}>
                                            <Typography className={classes.heading}>{row.name}</Typography>
                                        </div>
                                        <div className={classes.column}>
                                            <Typography className={classes.secondaryHeading}>Select Sensor Location</Typography>
                                        </div>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                    <div className={classes.column} />
                                    <div>
                                        {/* <List dense> */}
                                        <GridList>
                                        {stateData[row.insid] &&
                                            stateData[row.insid].details.map((dt, index) => {
                                                return <GridListTile key={index}>
                                                    <div>{dt.id}</div>
                                                    <Checkbox
                                                        checked={stateData.deviceChecked.indexOf(dt.id) !== -1}/>
                                                    </GridListTile>

                                                
                                            // return<ListItem button key={index} button onClick={handleDeviceToggle(dt.id)}>
                                            //         <ListItemText primary={dt.id} />
                                            //         <Checkbox
                                            //             checked={stateData.deviceChecked.indexOf(dt.id) !== -1}
                                            //         />
                                            //     </ListItem>
                                            })
                                        }
                                        {/* </List> */}
                                        </GridList>
                                    </div>
                                    </ExpansionPanelDetails>
                                  </ExpansionPanel>
                                    // return <Card className={classes.card} key={index}>
                                    //     <CardHeader avatar={
                                    //         <Avatar aria-label="Recipe" className={classes.avatar}>
                                    //             {row.name.split(' ').map((val) => {
                                    //                 return (val.substr(0,1))
                                    //         })}</Avatar>}
                                    //         title={row.name}
                                    //     subheader={row.locn}/>
                                    //     <CardActions className={classes.actions} disableActionSpacing>
                                    //         <IconButton
                                    //             className={classnames(classes.expand, {
                                    //             [classes.expandOpen]: stateData[index],
                                    //             })}
                                    //             onClick={event => handleExpandClick(index, row.insid, row.PID)}>
                                    //             <ExpandMoreIcon />
                                    //         </IconButton>
                                    //     </CardActions>
                                    //     <Collapse in={stateData[index]}
                                    //         timeout="auto" unmountOnExit
                                    //         className={classes.collapse}>
                                    //         {stateData[row.insid] &&
                                    //         <CardContent>
                                    //             <List dense>
                                    //             {stateData[row.insid].details.map((dt, index) => {
                                    //                  return<ListItem button key={index} button onClick={handleDeviceToggle(dt.id)}>
                                    //                     <ListItemText primary={dt.id} />
                                    //                     <Checkbox
                                    //                         checked={stateData.deviceChecked.indexOf(dt.id) !== -1}
                                    //                     />
                                    //                 </ListItem>
                                    //             })}
                                    //             </List>
                                    //         </CardContent>
                                    //         }
                                    //     </Collapse>
                                    // </Card>
                                })}
                            </div>
                        }
                        <Grid item
                            container
                            alignItems='center'
                            direction='row'
                            justify='flex-end'
                            >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onNextClick}
                                >
                                Next
                            </Button>
                        </Grid>
                    </div>
                }
                {type === REPORT_TABS['SERVICE'] &&
                    <div className={classes.gridRoot}>
                        <GridList cellHeight={130} className={classes.gridList}>
                            {Object.keys(SERVICES).map((key, index) => (
                                <Card className={classes.card} key={SERVICES[key]['id']}>
                                    <CardHeader
                                    avatar={
                                        <Avatar aria-label="Recipe" className={classes.avatar}>
                                        {SERVICES[key]['avatar']}
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton>
                                            <Checkbox
                                            checked={stateData.serviceChecked.indexOf(SERVICES[key]['id']) !== -1}
                                            onChange={handleServiceToggle(SERVICES[key]['id'])}/>
                                        </IconButton>
                                    }
                                    title={SERVICES[key]['display']}
                                    subheader={SERVICES[key]['description']}
                                    />
                                </Card>
                            ))}
                        </GridList>
                        <Grid container spacing={24}
                            direction="row"
                            justify="space-between"
                            alignItems='center'>
                            <Grid item>
                                <Button
                                    onClick={onPreviousClick}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}>
                                    Previous
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={onNextClick}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}>
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                }
                {type === REPORT_TABS['SCHEDULE'] &&
                <div>
                    <Grid item
                            container
                            alignItems='center'
                            direction='row'
                            justify='flex-start'
                            >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onPreviousClick}
                                >
                                Previous
                            </Button>
                        </Grid>
                </div>
                }
            </div>
        )
    }
}

export default withStyles(styles)(ReportContent);