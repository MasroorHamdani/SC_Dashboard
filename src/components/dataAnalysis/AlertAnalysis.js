import React, { Component } from 'react';
import {withStyles, ExpansionPanel, ExpansionPanelSummary,
    Typography, ExpansionPanelDetails, Chip, LinearProgress,
    FormControl, InputLabel, Select, Button} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {formatDateTime} from '../../utils/DateFormat';
import {ALERT_STATUS, DATE_TIME_FORMAT,
    DESCRIPTIVE_DATE_TIME_FORMAT, HOUR_MIN_FORMAT} from '../../constants/Constant';

import styles from './DataAnalysisStyle';

class AlertAnalysis extends Component {
    render() {
        const {classes, stateData, handleChangeStart,
            handleChangeEnd, getAlertData, showDate,
            setStateValue, showFilter} = this.props;
        let alertData;
        if(stateData.alertData) {
            alertData = stateData.alertData;
        } else if(stateData.length> 0) {
            alertData = stateData;
        }
        return (
            <div className={classes.root}>
            {stateData.loading &&
                <LinearProgress className={classes.buttonProgress}/>
            }
            {showDate &&
                <div className={classes.dateRow}>
                    <Typography variant="h6" className={classes.marginRight} >Custom</Typography>
                    <DatePicker
                        className={classes.marginRight}
                        selected={stateData.startDate}
                        selectsStart
                        startDate={stateData.startDate}
                        endDate={stateData.endDate}
                        onChange={handleChangeStart}
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={5}
                        dateFormat="MM/d/YY HH:mm"
                        timeCaption="Time"
                        maxDate={new Date()}
                    />
                    <DatePicker
                        className={classes.marginRight}
                        selected={stateData.endDate}
                        selectsEnd
                        startDate={stateData.startDate}
                        endDate={stateData.endDate}
                        onChange={handleChangeEnd}
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={5}
                        dateFormat="MM/d/YY HH:mm"
                        timeCaption="Time"
                        minDate={stateData.startDate}
                        maxDate={new Date()}
                    />
                    <Button onClick={getAlertData}
                        color="primary" variant="contained"
                        size="small">
                        Go
                    </Button>
                </div>
            }
            {showFilter &&
                <div className={classes.dateRow}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-native-helper">Location</InputLabel>
                        <Select native
                            value={stateData.insid}
                            onChange={setStateValue}
                            inputProps={{
                                name: 'insid',
                                id: 'insid',
                            }}>
                        <option value="" />
                        {stateData.locationList.map(function(loc) {
                            return <option value={loc.insid} name={loc.insid} key={loc.insid} >
                                {loc.name} | {loc.locn}</option>
                        })}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary"
                        onClick={getAlertData}>
                        Filter
                    </Button>
                </div>
            }
            {alertData &&
                    alertData.map((row, index) => {
                        return (<ExpansionPanel key={index}>
                            {row.header &&
                                <ExpansionPanelSummary className={classes.expansionRoot} expandIcon={<ExpandMoreIcon />}>
                                <div className={classes.heading}>
                                    <Typography variant="h6">{row.header.StatusInfo.Reason}
                                    {row.header.name ?
                                        ` - ${row.header.name} (${row.header.locn})`
                                    :''}
                                    ({row.data.length > 0 ? `${row.data[0].Data.Type}` : ''})
                                    </Typography>
                                    <Typography>
                                        {formatDateTime(row.header.Timestamp,
                                            DATE_TIME_FORMAT,
                                            DESCRIPTIVE_DATE_TIME_FORMAT)}
                                    </Typography>
                                    </div>
                                    <Chip
                                        label={ALERT_STATUS[row.header.StatusInfo.Status]}
                                        className={classes[row.header.StatusInfo.Status]}
                                    />
                                </ExpansionPanelSummary>
                            }
                            {row.data.map((dt, index) => {
                                return<ExpansionPanelDetails key={index}>
                                    <Typography className={classes.content}>
                                        {formatDateTime(dt.Timestamp, DATE_TIME_FORMAT, HOUR_MIN_FORMAT)}
                                    </Typography>
                                    <Typography>{dt.Data.Text}</Typography>
                                </ExpansionPanelDetails>
                            })}
                        </ExpansionPanel>)
                    })
            }
            </div>
        )
    }
}

export default withStyles(styles)(AlertAnalysis);