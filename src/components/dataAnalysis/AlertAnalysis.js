import React, { Component } from 'react';
import {withStyles, ExpansionPanel, ExpansionPanelSummary,
    Typography, ExpansionPanelDetails, Chip} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {getFormatedDateTime, formatDateTime} from '../../utils/DateFormat';
import {ALERT_STATUS} from '../../constants/Constant';

import styles from './DataAnalysisStyle';

class AlertAnalysis extends Component {
    render() {
        const {classes, stateData, handleChangeStart,
            handleChangeEnd, getAlertData} = this.props;
        
        return (
            <div className={classes.root}>
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
            {stateData.alertData &&
                    stateData.alertData.map((row, index) => {
                        return (<ExpansionPanel key={index}>
                            {row.header &&
                                <ExpansionPanelSummary className={classes.expansionRoot} expandIcon={<ExpandMoreIcon />}>
                                <div className={classes.heading}>
                                    <Typography variant="h6">{row.header.StatusInfo.Reason}</Typography>
                                    <Typography>
                                        {formatDateTime(row.header.Timestamp,
                                            'YYYYMMDDHHmmss',
                                            'dddd, MMMM Do, YYYY h:mm:ss a')}
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
                                        {getFormatedDateTime(dt.Timestamp, 'hh:mm A')}
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