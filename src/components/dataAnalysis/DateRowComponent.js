import React, { Component } from 'react';
import {withStyles, ListItem, ListItemText, Typography,
    List, Button} from '@material-ui/core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from './AnalysisDataStyle';
import RefreshIcon from '@material-ui/icons/Refresh';

class DateRowComponent extends Component {
/**
 * Date component, which will show the Datetime picker for start and end date with a go button
 * as well, some predefined options like, 1h, 2h etc along with refresh button.
 */
    render () {
        const {classes, handleListSelection, handleChangeStart, handleChangeEnd,
            handleDatePicker, data, timeList, handleRefresh,
            isCustomModal, modalHandleChangeStart, modalHandleChangeEnd} = this.props;
        return (
            <div className={classes.dateRow}>
                <div className={classes.dateRow}>
                    <Typography className={classes.marginRight}>Custom</Typography>
                    <DatePicker
                        className={classes.marginRight}
                        selected={(isCustomModal ? data.modalStartDate : data.startDate)}
                        selectsStart
                        startDate={(isCustomModal ? data.modalStartDate : data.startDate)}
                        endDate={(isCustomModal ? data.modalEndDate : data.endDate)}
                        onChange={(isCustomModal ? modalHandleChangeStart : handleChangeStart)}//{handleChangeStart}
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
                        selected={(isCustomModal ? data.modalEndDate : data.endDate)}
                        selectsEnd
                        startDate={(isCustomModal ? data.modalStartDate : data.startDate)}
                        endDate={(isCustomModal ? data.modalEndDate : data.endDate)}
                        onChange={(isCustomModal ? modalHandleChangeEnd : handleChangeEnd)}
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={5}
                        dateFormat="MM/d/YY HH:mm"
                        timeCaption="Time"
                        minDate={(isCustomModal ? data.modalStartDate : data.startDate)}
                        maxDate={new Date()}
                    />
                    <Button onClick={e=>handleDatePicker(isCustomModal ? 'modal' : 'default')}
                        color="primary" variant="contained"
                        size="small">
                        Go
                    </Button>
                </div>
                <List dense={true} className={classes.timeList}>
                    {timeList.map((timeLine) => {
                        return <ListItem className={classes.noLeftPadding}
                        key={timeLine.key} name={timeLine.name} value={timeLine.value}
                        onClick={e => handleListSelection(e, timeLine.text, timeLine.value, isCustomModal ? 'modal' : 'default')}>
                            < ListItemText
                            primary={<Typography type="span"
                            style={(isCustomModal ? data.modalSelectedIndex === timeLine.value : data.selectedIndex === timeLine.value)?
                                { fontWeight: 'bold' }: {fontWeight: 'inherit'}}>{timeLine.text}</Typography>}
                            />
                        </ListItem>
                    })}
                </List>
                {handleRefresh &&
                    <RefreshIcon className={classes.pointer}
                    onClick={handleRefresh}/>
                }
                {data.rangeError &&
                    <Typography className={classes.errorMessage}>{data.rangeError}</Typography>
                }
            </div>
        )
    }
}

export default withStyles(styles)(DateRowComponent);