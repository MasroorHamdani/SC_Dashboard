import React, { Component } from 'react';
import {withStyles, FormControl, InputLabel, Input,
    NativeSelect, TextField} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import "react-datepicker/dist/react-datepicker.css";
import {FUNCTION_LIST, DATA_OPERATIONS} from '../../constants/Constant';
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
            t=><div>
                { (metrics && stateData[stateData.deviceKey] &&
                    stateData[stateData.deviceKey][metrics.metric_id]) &&
                    metrics.dimensions.map((dt) => {
                        if(stateData[stateData.deviceKey][metrics.metric_id][dt.id]) {
                            return stateData[stateData.deviceKey][metrics.metric_id][dt.id].map((row, index) => {
                                // if(row.type === DATA_OPERATIONS['FILTER']) {
                                //    return <div className={classes.dateRow}>filter type</div>
                                // } else 
                                if(row.type === DATA_OPERATIONS['RESAMPLER']) {
                                    return <div className={classes.dateRow} key={index}>
                                        <TextField
                                            disabled
                                            id="sampling"
                                            label="Sampling Rate"
                                            name="sampling"
                                            value={row.criteria.sampling}
                                            onChange={event => handleSamplingChange(event, metrics.metric_id, dt.id, DATA_OPERATIONS['RESAMPLER'])}
                                            margin="normal"
                                        />
                                        <TextField
                                            disabled
                                            id="unit"
                                            label={t('unit')}
                                            name="unit"
                                            value={stateData[stateData.deviceKey][metrics.metric_id][dt.id].unit}
                                            margin="normal"
                                        />
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
                                                value={row.criteria.statistic}
                                                onChange={event => handleSamplingChange(event, metrics.metric_id, dt.id, DATA_OPERATIONS['RESAMPLER'])}
                                                input={<Input name='statistic' id="fstatistic-native-label-placeholder" />}>
                                                <option value='' key='statistic' >{t('chooseFunc')}</option>
                                                { FUNCTION_LIST.map((func) => {
                                                        return <option value={func.value} key={func.value}>{func.name}</option>
                                                })}
                                            </NativeSelect>
                                        </FormControl>
                                        <ArrowForwardIcon className={classes.pointer} name="update" id="update"
                                            onClick={event => handleSamplingChange(event, 'update')}/>
                                    </div>
                                }
                            })
                        }
                    }
                )}
            </div>
            }</NamespacesConsumer>
        )
    }
}

export default withStyles(styles)(DataProcessingComponent);