import React, { Component } from 'react';
import {withStyles, Card, CardHeader, Avatar,
    IconButton, GridList, Checkbox, Button,
    FormControl, InputLabel, NativeSelect,
    FormHelperText, Input, Grid, CardActions,
    Collapse, CardContent, Typography} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import {REPORT_TABS, SERVICES} from '../../constants/Constant';
import styles from './ReportGenerationStyle';

class ReportContent extends Component {
    state = { };
    handleExpandClick = (index, value) => {
        this.setState({ [index]: !value });
        // this.setState(state => ({ [index]: !state[index] }));
    };
    render() {
        const {type, classes, data, stateData,
            handleProjectSelectionChange} = this.props;
        return(
            <div>
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
                                            <Checkbox/>
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
                                <Button variant="contained" color="primary" className={classes.button}>
                                    Previous
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" className={classes.button}>
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                }
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
                                <option value='test' key='test' id='test'>test</option>
                                { (data.DashboardReducer.data && data.DashboardReducer.data.Projects) &&
                                    data.DashboardReducer.data.Projects.map(function(dt) {
                                        return <option value={dt.pid} key={dt.pid}>{dt.name}</option>
                                    })
                                }
                            </NativeSelect>
                            <FormHelperText>Please Select the Project to generate Report for</FormHelperText>
                        </FormControl>
                        {data.ProjectDetailsReducer.data &&
                            <div className={classnames(classes.gridRoot, classes.gridList)}>
                                {data.ProjectDetailsReducer.data.map((row, index) => {
                                    return <Card className={classes.card} key={index}>
                                        <CardHeader avatar={
                                            <Avatar aria-label="Recipe" className={classes.avatar}>
                                                {row.name.split(' ').map((val) => {
                                                    return (val.substr(0,1))
                                                    })}
                                            </Avatar>}
                                            title={row.name}
                                            subheader={row.locn}/>
                                        <CardActions className={classes.actions} disableActionSpacing>
                                            <IconButton
                                                className={classnames(classes.expand, {
                                                [classes.expandOpen]: this.state[index],
                                                })}
                                                onClick={event => this.handleExpandClick(index, this.state[index])}
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                            </CardActions>
                                            <Collapse in={this.state[index]} timeout="auto" unmountOnExit>
                                            <CardContent>
                                            <Typography paragraph>Method:</Typography>
                                            </CardContent>
                                            </Collapse>
                                    </Card>
                                })}
                            </div>
                        }
                        
                    </div>
                }
            </div>
        )
    }
}
export default withStyles(styles)(ReportContent);