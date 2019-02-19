import React, { Component } from 'react';
import {withStyles, ExpansionPanel, ExpansionPanelSummary,
    Typography, ExpansionPanelDetails, Chip, LinearProgress} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {getFormatedDateTime, formatDateTime} from '../../utils/DateFormat';
import {ALERT_STATUS, DATE_TIME_FORMAT,
    DESCRIPTIVE_DATE_TIME_FORMAT, HOUR_MIN_FORMAT} from '../../constants/Constant';

import styles from './DataAnalysisStyle';

class AlertAnalysis extends Component {
    render() {
        const {classes, stateData, handleChangeStart,
            handleChangeEnd, getAlertData, showDate} = this.props;
        let alertData;
        if(stateData.alertData) {
            alertData = stateData.alertData;
        } else if(stateData.length> 0)
            alertData = stateData;
        return (
            <div className={classes.root}>
            {stateData.loading &&
                <LinearProgress className={classes.buttonProgress}/>
            }
            {showDate &&
                <div className={classes.dateRow}>
                    <Typography>Custom</Typography>
                    <DatePicker
                        selected={stateData.startDate}
                        selectsStart
                        startDate={stateData.startDate}
                        endDate={stateData.endDate}
                        onChange={handleChangeStart}
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MM/d/YY HH:mm"
                        timeCaption="Time"
                        maxDate={new Date()}
                    />
                    <DatePicker
                        selected={stateData.endDate}
                        selectsEnd
                        startDate={stateData.startDate}
                        endDate={stateData.endDate}
                        onChange={handleChangeEnd}
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MM/d/YY HH:mm"
                        timeCaption="Time"
                        minDate={stateData.startDate}
                        maxDate={new Date()}
                    />
                    <button onClick={getAlertData}>Go</button>
                </div>
            }
            {alertData &&
                    alertData.map((row, index) => {
                        return (<ExpansionPanel key={index}>
                            {row.header &&
                                <ExpansionPanelSummary className={classes.expansionRoot} expandIcon={<ExpandMoreIcon />}>
                                <div className={classes.heading}>
                                    <Typography variant="h6">{row.header.StatusInfo.Reason}</Typography>
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
                                        {getFormatedDateTime(dt.Timestamp, HOUR_MIN_FORMAT)}
                                        {/* {dt.Data.Type} */}
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