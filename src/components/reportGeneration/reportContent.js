import React, { Component } from 'react';
import {withStyles, Card, CardHeader, Avatar,
    IconButton, GridList, Checkbox, Button,
    FormControl, InputLabel, NativeSelect,
    FormHelperText, Input, Grid, List,
    ListItem, ListItemText, ExpansionPanelDetails,
    ExpansionPanel, ExpansionPanelSummary, Typography,
    Radio} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
                {type === REPORT_TABS['SERVICE'] &&
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
                        {stateData.project &&
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
                                                <Radio
                                                checked={stateData.serviceChecked === (SERVICES[key]['id'])}
                                                onChange={handleServiceToggle(SERVICES[key]['id'])}
                                                />
                                                {/* <Checkbox
                                                checked={stateData.serviceChecked.indexOf(SERVICES[key]['id']) !== -1}
                                                onChange={handleServiceToggle(SERVICES[key]['id'])}/> */}
                                            </IconButton>
                                        }
                                        title={SERVICES[key]['display']}
                                        subheader={SERVICES[key]['description']}
                                        />
                                    </Card>
                                ))}
                            </GridList>
                            <Grid
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
                    </div>
                }
                {type === REPORT_TABS['LOCATION'] &&
                    <div>
                        {data.ProjectDetailsReducer.data &&
                            data.ProjectDetailsReducer.data.map((row, index) => {
                                return <ExpansionPanel key={index}>
                                <ExpansionPanelSummary
                                    onClick={event => handleExpandClick(index, row.insid, row.PID)}
                                    expandIcon={<ExpandMoreIcon/>}>
                                    <div className={classes.column}>
                                        <Typography className={classes.heading}>{row.name}, {row.locn}</Typography>
                                    </div>
                                    <div className={classes.column}>
                                        <Typography className={classes.secondaryHeading}>Select Sensor Location</Typography>
                                    </div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <List dense className={classes.flexList}>
                                    {stateData[row.insid] &&
                                        stateData[row.insid].details.map((dt, index) => {
                                        return<ListItem className={classes.listItem} button key={index} button onClick={handleDeviceToggle(dt.id)}>
                                                <Checkbox
                                                    checked={stateData.deviceChecked.indexOf(dt.id) !== -1}
                                                />
                                                <ListItemText primary={dt.id} />
                                            </ListItem>
                                        })
                                    }
                                    </List>
                                </ExpansionPanelDetails>
                                </ExpansionPanel>
                            })
                        }
                        <Grid container spacing={24}
                            direction="row"
                            justify="space-between"
                            alignItems='center'
                            className={classes.gridFooter}>
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
                
                {type === REPORT_TABS['CONFIGURE'] &&
                <div>
                    <Grid className={classes.gridFooter} 
                        item
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