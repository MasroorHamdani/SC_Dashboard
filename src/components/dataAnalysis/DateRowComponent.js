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
            handleDatePicker, data, timeList, handleRefresh} = this.props;
        return (
            <div className={classes.dateRow}>
                <div className={classes.dateRow}>
                    <Typography className={classes.marginRight}>Custom</Typography>
                    <DatePicker
                        className={classes.marginRight}
                        selected={data.startDate}
                        selectsStart
                        startDate={data.startDate}
                        endDate={data.endDate}
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
                        className={classes.marginRight}
                        selected={data.endDate}
                        selectsEnd
                        startDate={data.startDate}
                        endDate={data.endDate}
                        onChange={handleChangeEnd}
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MM/d/YY HH:mm"
                        timeCaption="Time"
                        minDate={data.startDate}
                        maxDate={new Date()}
                    />
                    <Button onClick={handleDatePicker}
                        color="primary" variant="contained"
                        size="small">
                        Go
                    </Button>
                </div>
                <List dense={true} className={classes.timeList}>
                    {timeList.map((timeLine) => {
                        return <ListItem key={timeLine.key} name={timeLine.name} value={timeLine.value}
                        onClick={e => handleListSelection(e, timeLine.text, timeLine.value)}>
                            < ListItemText
                            primary={<Typography type="span"
                            style={(data.selectedIndex === timeLine.value)?
                                { fontWeight: 'bold' }: {fontWeight: 'inherit'}}>{timeLine.text}</Typography>}
                            />
                        </ListItem>
                    })}
                </List>
                {handleRefresh &&
                    <RefreshIcon className={classes.pointer}
                    onClick={handleRefresh}/>
                }
            </div>
        )
    }
}

export default withStyles(styles)(DateRowComponent);