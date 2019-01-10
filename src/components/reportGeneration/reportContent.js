import React, { Component } from 'react';
import {withStyles, Card, CardHeader, Avatar,
    IconButton, GridList, Checkbox, Button,
    FormControl, InputLabel, NativeSelect,
    FormHelperText, Input, Grid, List,
    ListItem, ListItemText, ExpansionPanelDetails,
    ExpansionPanel, ExpansionPanelSummary, Typography,
    Radio, TextField} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {REPORT_TABS, SERVICES, SERVICE_TABS} from '../../constants/Constant';
import styles from './ReportGenerationStyle';
import { NamespacesConsumer } from 'react-i18next';
import _ from 'lodash';
import ReportComponent from './ReportComponent';

class ReportContent extends Component {
    state = { };
    
    render() {
        const {type, classes, data, stateData,
            handleProjectSelectionChange, handleExpandClick,
            handleDeviceToggle, onNextClick, onPreviousClick,
            handleServiceToggle, shouldDisableCheckbox,
            onChange, generateReport} = this.props;
            let rtypeOptions = [
                {key: 'PDF', value: 'pdf'},
                {key: 'Email', value: 'email'}
            ]
        return(
            <NamespacesConsumer>
            {
            t=><div>
                {type === REPORT_TABS['SERVICE'] &&
                    <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="project-native-label-placeholder">
                                {t('projectList')}
                            </InputLabel>
                            <NativeSelect
                                value={stateData.project}
                                onChange={handleProjectSelectionChange}
                                input={<Input name="project" id="project-native-label-placeholder" />}>
                                <option value='' key='project' id='project'>{t('chooseProject')}</option>
                                { (data.projectList && data.projectList.Projects) &&
                                    data.projectList.Projects.map(function(dt) {
                                        return <option value={dt.pid} key={dt.pid}>{dt.name}</option>
                                    })
                                }
                            </NativeSelect>
                            <FormHelperText>{t('projectHelpText')}</FormHelperText>
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
                                    {t('next')}
                                </Button>
                            </Grid>
                            
                        </div>
                        }
                    </div>
                }
                {type === REPORT_TABS['LOCATION'] &&
                    <div>
                        {data.projectDetails &&
                            data.projectDetails.map((row, index) => {
                                let {Key} = stateData.device,
                                    type = stateData.device.Accept[0]['V'],
                                    deviceSelected = stateData.device[Key]
                                return <ExpansionPanel key={index}>
                                <ExpansionPanelSummary
                                    onClick={event => handleExpandClick(index, row.insid, row.PID)}
                                    expandIcon={<ExpandMoreIcon/>}>
                                    <div className={classes.column}>
                                        <Typography className={classes.heading}>{row.name}, {row.locn}</Typography>
                                    </div>
                                    <div className={classes.column}>
                                        <Typography className={classes.secondaryHeading}>{stateData.device['Disp']}</Typography>
                                    </div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <List dense className={classes.flexList}>
                                    {stateData[row.insid] &&
                                        stateData[row.insid].details.map((dt, index) => {
                                            if(dt.type === type)
                                                return<ListItem className={classes.listItem} button key={index} button
                                                onClick={handleDeviceToggle(dt.id)}>
                                                    <Checkbox
                                                        checked={deviceSelected.indexOf(dt.id) !== -1}
                                                        disabled={shouldDisableCheckbox(dt.id)}
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
                                    {t('previous')}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={onNextClick}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}>
                                    {t('next')}
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                }
                
                {type === REPORT_TABS['CONFIGURE'] &&
                
                <div className={classes.formControl}>
                    <div>
                        <Typography variant="h6">Input Parameters required</Typography>
                        {(stateData && stateData.inputFields) &&
                            stateData.inputFields.map((dt, index) => {
                                if(dt.Key !== SERVICE_TABS['DEVICE'] && dt.Key !== SERVICE_TABS['LOCATION'])
                                    return <ReportComponent key={index} value={dt.Key} disp={dt.Disp}
                                        format={dt.Accept[0]['V']} stateData={stateData}
                                        onChange={onChange} type={dt.Type} defaultVal={dt.Default}
                                        toolTip={dt.Description}/>
                            })
                        }
                    </div>
                    <div className={classes.seperator}>
                        <Typography variant="h6">Select the Report format type</Typography>
                        {(stateData && stateData.outputFields) &&
                            stateData.outputFields.map((dt, index) => {
                                if(dt.Key !== SERVICE_TABS['DEVICE'] && dt.Key !== SERVICE_TABS['LOCATION'])
                                    return <ReportComponent key={index} value={dt.Key} disp={dt.Disp}
                                        stateData={stateData} onChange={onChange}
                                        type={dt.Type} toolTip={dt.Description}/>
                            })
                        }
                        <ReportComponent value='title' disp="Enter Report Title"
                            stateData={stateData} onChange={onChange}
                            type='string' toolTip="This name will be used while sharing the report"/>
                        <ReportComponent value='schedule' disp="Schedule Report Generation"
                            stateData={stateData} onChange={onChange}
                            type='strdropdown' toolTip="This depicts the report scheduling time."/>
                        <ReportComponent value='rtype' disp="Generated Report type"
                            stateData={stateData} onChange={onChange}
                            type='dropdown' menu={rtypeOptions} toolTip="Select the type of report sharing procedure"/>
                        {stateData.rtype === 'email' &&
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id='email'
                                    name='email'
                                    label='Enter Email to receive generated Reports' 
                                    fullWidth
                                    autoComplete='email'
                                    value={stateData.email}
                                    onChange={onChange}/>
                            </Grid>
                        }
                    </div>
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
                                {t('previous')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                onClick={generateReport}
                                variant="contained"
                                color="primary"
                                className={classes.button}>
                                Create Report
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                }
            </div>
            }</NamespacesConsumer>
        )
    }
}

export default withStyles(styles)(ReportContent);