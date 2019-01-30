import React, { Component } from 'react';
import {withStyles, FormControl, InputLabel, Input,
    NativeSelect, TextField, Button} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import "react-datepicker/dist/react-datepicker.css";
import {FUNCTION_LIST} from '../../constants/Constant';
import styles from './AnalysisDataStyle';
import { NamespacesConsumer } from 'react-i18next';

class DataProcessingComponent extends Component {
    render () {
        const {classes, stateData, handleSamplingChange,
            getMetric, metrics} = this.props;
        // let metrics = getMetric();
        // metrics = metrics.metric;
        console.log(stateData);
        return (
            <NamespacesConsumer>
            {
            t=><div >
                { (metrics && stateData[metrics.metricID]) &&
                    metrics.dimensions.map((dt, index) => {
                        if (dt.showSamplingWidget) {
                            return <div className={classes.dateRow} key={index}>
                                <TextField
                                    id="sampling"
                                    label="Sampling Rate"
                                    name="sampling"
                                    value={stateData[metrics.metricID][dt.id].sampling}
                                    onChange={event => handleSamplingChange(event, dt.id)}
                                    margin="normal"
                                />
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="unit-native-label-placeholder">
                                        {t('unit')}
                                    </InputLabel>
                                    <NativeSelect
                                        value={stateData[metrics.metricID][dt.id].unit}
                                        onChange={event => handleSamplingChange(event, dt.id)}
                                        input={<Input name="unit" id="unit-native-label-placeholder" />}>
                                        <option value='' name="unit" key='unit'>{t('chooseUnit')}</option>
                                        <option value='T' name="unit" key='min'>Mins</option>
                                        <option value='hour' name="unit" key='hour'>Hour</option>
                                    </NativeSelect>
                                </FormControl>
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
                                        value={stateData[metrics.metricID][dt.id].func}
                                        onChange={event => handleSamplingChange(event, dt.id)}
                                        input={<Input name='func' id="func-native-label-placeholder" />}>
                                        <option value='' key='func' >{t('chooseFunc')}</option>
                                        { FUNCTION_LIST.map((func) => {
                                                return <option value={func.value} key={func.value}>{func.name}</option>
                                        })}
                                    </NativeSelect>
                                </FormControl>
                                <ArrowForwardIcon className={classes.pointer} id="update" onClick={handleSamplingChange}/>
                            </div>
                        }
                    }
                )}
            </div>
            }</NamespacesConsumer>
        )
    }
}

export default withStyles(styles)(DataProcessingComponent);