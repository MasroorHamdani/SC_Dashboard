import React, { Component } from 'react';
import { withStyles, Grid, TextField, FormControlLabel,
    Switch, FormControl, InputLabel, NativeSelect,
    Input, Tooltip} from '@material-ui/core';
import {FIELD_TYPE, STRING_FIELD_FORMAT, HOUR_FORMAT} from '../../constants/Constant';
import styles from './ReportGenerationStyle';
import {getFormatedDateTime} from '../../utils/DateFormat';

class ReportComponent extends Component {
    render() {
        const {classes, value, disp, format, stateData, onChange,
            type, defaultVal, data, toolTip} = this.props;
        return (
            <Grid item xs={12} sm={6}>
                {(type === FIELD_TYPE['STRING'] && format === STRING_FIELD_FORMAT['TIME']) &&
                <Tooltip title={toolTip} placement="right">
                    <TextField
                        className={classes.timePickerTextField}
                        id={value}
                        name={value}
                        label={disp}
                        type="time"
                        defaultValue={defaultVal ? getFormatedDateTime(defaultVal, HOUR_FORMAT) : ''}
                        onChange={onChange}/>
                </Tooltip>
                }
                {(type === FIELD_TYPE['STRING'] && format === STRING_FIELD_FORMAT['STRDROPDOWN']) &&
                    <div>
                        <Tooltip title={toolTip} placement="right">
                            <TextField
                            className={classes.timePickerTextField}
                            label={disp}
                            id={value}
                            name={value}
                            onChange={onChange}
                            value={stateData[value]}
                            margin="normal"
                            />
                        </Tooltip>
                        <FormControl className={classes.seperator}>
                            <InputLabel shrink htmlFor="unit-native-label-placeholder">
                                Unit
                            </InputLabel>
                            <NativeSelect
                                value={stateData.scheduleUnit}
                                onChange={onChange}
                                input={<Input name="scheduleUnit" id="unit-native-label-placeholder" />}>
                                <option value='' name="scheduleUnit" key='unit'>Choose Unit</option>
                                <option value='min' name="scheduleUnit" key='min'>Mins</option>
                                <option value='hour' name="scheduleUnit" key='hour'>Hour</option>
                                <option value='day' name="scheduleUnit" key='day'>Day</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                }
                {(type === FIELD_TYPE['STRING'] && format === STRING_FIELD_FORMAT['DROPDOWN']) &&
                    <Tooltip title={toolTip} placement="right">
                        <FormControl className={classes.timePickerTextField}>
                            <InputLabel shrink htmlFor="unit-native-label-placeholder">
                                {disp}
                            </InputLabel>
                            <NativeSelect
                                value={stateData[value]}
                                onChange={onChange}
                                input={<Input name={value} id="unit-native-label-placeholder" />}>
                                <option value='' name={value} key='rtypeValue'>Choose value</option>
                                {data.map((row) => {
                                    return<option value={row.value} name={value} key={row.value}>{row.key}</option>
                                })}
                            </NativeSelect>
                        </FormControl>
                    </Tooltip>
                }
                {(type === FIELD_TYPE['STRING'] && format === STRING_FIELD_FORMAT['DELTADAYS']) &&
                    <Tooltip title={toolTip} placement="right">
                        <TextField
                        type='number'
                        required
                        id={value}
                        name={value}
                        label={disp} 
                        fullWidth
                        autoComplete={value}
                        value={stateData[value]}
                        onChange={onChange}/>
                    </Tooltip>
                }
                {(type === FIELD_TYPE['STRING'] && !format) &&
                    <Tooltip title={toolTip} placement="right">
                        <TextField
                        required
                        id={value}
                        name={value}
                        label={disp} 
                        fullWidth
                        autoComplete={value}
                        value={stateData[value]}
                        onChange={onChange}/>
                    </Tooltip>
                }
                {type === FIELD_TYPE['BOOLEAN'] &&
                    <Tooltip title={toolTip} placement="right">
                        <FormControlLabel
                        label={disp}
                        id={value}
                        name={value}
                        control={
                            <Switch
                            checked={stateData[value]}
                            onChange={onChange}
                            value={stateData[value]}
                            />}
                        />
                    </Tooltip>
                }
           </Grid>
        )
    }
}

export default withStyles(styles)(ReportComponent);