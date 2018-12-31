import React, { Component } from 'react';
import {withStyles, FormControl, InputLabel, Input,
    NativeSelect, TextField} from '@material-ui/core';
import "react-datepicker/dist/react-datepicker.css";
import {FUNCTION_LIST} from '../../constants/Constant';
import styles from './AnalysisDataStyle';
import { NamespacesConsumer } from 'react-i18next';

class DataProcessingComponent extends Component {
    render () {
        const {classes, handleListSelection, handleChangeStart, handleChangeEnd,
            handleDatePicker, stateData, timeList, handleRefresh} = this.props;
            console.log(stateData);
        return (
            <NamespacesConsumer>
            {
            t=><div className={classes.dateRow}>
                <TextField
                    id="unitValue"
                    label="Sampling Rate"
                    // className={classes.textField}
                    // value={this.state.name}
                    // onChange={this.handleChange('name')}
                    margin="normal"
                    />
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="unit-native-label-placeholder">
                        {t('unit')}
                    </InputLabel>
                    <NativeSelect
                        // value={stateData.project}
                        // onChange={handleProjectSelectionChange}
                        input={<Input name="unit" id="unit-native-label-placeholder" />}>
                        <option value='' key='unit'>{t('chooseUnit')}</option>
                        <option value='min' key='min'>Mins</option>
                        <option value='hour' key='hour'>Hour</option>
                    </NativeSelect>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="statistic-native-label-placeholder">
                        {t('statistic')}
                    </InputLabel>
                    <NativeSelect
                        // value={stateData.project}
                        // onChange={handleProjectSelectionChange}
                        input={<Input name="statistic" id="statistic-native-label-placeholder" />}>
                        <option value='' key='statistic' id='statistic'>{t('chooseStatistic')}</option>
                        { (stateData.aqMetrics && stateData.aqMetrics.vector )&&
                            stateData.aqMetrics.vector.map((dt) => {
                                return <option value={dt.Path} key={dt.Path}>{dt.name}</option>
                        })}
                    </NativeSelect>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="func-native-label-placeholder">
                        {t('func')}
                    </InputLabel>
                    <NativeSelect
                        // value={stateData.project}
                        // onChange={handleProjectSelectionChange}
                        input={<Input name="func" id="func-native-label-placeholder" />}>
                        <option value='' key='func' id='func'>{t('chooseFunc')}</option>
                        { FUNCTION_LIST.map((dt) => {
                                return <option value={dt.value} key={dt.value}>{dt.name}</option>
                        })}
                    </NativeSelect>
                </FormControl>
            </div>
            }</NamespacesConsumer>
        )
    }
}

export default withStyles(styles)(DataProcessingComponent);