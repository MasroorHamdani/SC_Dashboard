import React, { Component } from 'react';
import {withStyles, FormControl, InputLabel, Input,
    NativeSelect, TextField} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import "react-datepicker/dist/react-datepicker.css";
import {FUNCTION_LIST} from '../../constants/Constant';
import styles from './AnalysisDataStyle';
import { NamespacesConsumer } from 'react-i18next';

class DataProcessingComponent extends Component {
/**
 * This component is used for sampler.
 * any dimension with show sampling as true, will be show up.
 * Any change will be passsed to parent using the inherited function.
 */
    render () {
        const {classes, stateData, handleSamplingChange,
                metrics} = this.props;
        return (
            <NamespacesConsumer>
            {
            t=><div >
                { (metrics && stateData[stateData.deviceKey] &&
                    stateData[stateData.deviceKey][metrics.metricID]) &&
                    metrics.dimensions.map((dt, index) => {
                        if (dt.showSamplingWidget) {
                            if(stateData[stateData.deviceKey][metrics.metricID][dt.id]) {
                                return <div className={classes.dateRow} key={index}>
                                    <TextField
                                        disabled
                                        id="sampling"
                                        label="Sampling Rate"
                                        name="sampling"
                                        value={stateData[stateData.deviceKey][metrics.metricID][dt.id].sampling}
                                        onChange={event => handleSamplingChange(event, metrics.metricID, dt.id)}
                                        margin="normal"
                                    />
                                    <TextField
                                        disabled
                                        id="unit"
                                        label={t('unit')}
                                        name="unit"
                                        value={stateData[stateData.deviceKey][metrics.metricID][dt.id].unit}
                                        margin="normal"
                                    />
                                    {/* <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="unit-native-label-placeholder">
                                            {t('unit')}
                                        </InputLabel>
                                        <NativeSelect
                                            disabled
                                            value={stateData[stateData.deviceKey][metrics.metricID][dt.id].unit}
                                            onChange={event => handleSamplingChange(event, metrics.metricID, dt.id)}
                                            input={<Input name="unit" id="unit-native-label-placeholder" />}>
                                            <option value='' name="unit" key='unit'>{t('chooseUnit')}</option>
                                            <option value='T' name="unit" key='min'>Mins</option>
                                            <option value='H' name="unit" key='hour'>Hour</option>
                                            <option value='D' name="unit" key='day'>Day</option>
                                            <option value='M' name="unit" key='month'>Month</option>
                                            <option value='Y' name="unit" key='year'>Year</option>
                                        </NativeSelect>
                                    </FormControl> */}
                                    <TextField
                                        disabled
                                        id={dt.id}
                                        label={t('dimension')}
                                        name="dimension"
                                        value={dt.name}
                                        margin="normal"
                                    />
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="func-native-label-placeholder">
                                            {t('func')}
                                        </InputLabel>
                                        <NativeSelect
                                            value={stateData[stateData.deviceKey][metrics.metricID][dt.id].func}
                                            onChange={event => handleSamplingChange(event, metrics.metricID, dt.id)}
                                            input={<Input name='func' id="func-native-label-placeholder" />}>
                                            <option value='' key='func' >{t('chooseFunc')}</option>
                                            { FUNCTION_LIST.map((func) => {
                                                    return <option value={func.value} key={func.value}>{func.name}</option>
                                            })}
                                        </NativeSelect>
                                    </FormControl>
                                    <ArrowForwardIcon className={classes.pointer} name="update" id="update"
                                        onClick={event => handleSamplingChange(event, 'update')}/>
                                </div>
                            }
                        }
                    }
                )}
            </div>
            }</NamespacesConsumer>
        )
    }
}

export default withStyles(styles)(DataProcessingComponent);