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
            getMetric} = this.props;
        let metrics = getMetric();
        return (
            <NamespacesConsumer>
            {
            t=><div >
                { metrics &&
                    metrics.map((dt, index) => {
                    return <div className={classes.dateRow} key={index}>
                        <TextField
                            id="sampling"
                            label="Sampling Rate"
                            name="sampling"
                             // value={stateData[dt.name] ? stateData[dt.name].sampling: ''}
                            // onChange={e => handleSamplingChange(e, dt.name)}
                            value={stateData.sampling}
                            onChange={handleSamplingChange}
                            margin="normal"
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="unit-native-label-placeholder">
                                {t('unit')}
                            </InputLabel>
                            <NativeSelect
                                value={stateData.unit}
                                onChange={handleSamplingChange}
                                input={<Input name="unit" id="unit-native-label-placeholder" />}>
                                <option value='' name="unit" key='unit'>{t('chooseUnit')}</option>
                                <option value='min' name="unit" key='min'>Mins</option>
                                <option value='hour' name="unit" key='hour'>Hour</option>
                            </NativeSelect>
                        </FormControl>
                        <TextField
                            disabled
                            id={dt.shortName}
                            label={t('dimension')}
                            name="dimension"
                            value={dt.path}
                            margin="normal"
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="func-native-label-placeholder">
                                {t('func')}
                            </InputLabel>
                            <NativeSelect
                                value={stateData.func}
                                onChange={handleSamplingChange}
                                input={<Input name="func" id="func-native-label-placeholder" />}>
                                <option value='' key='func' name="func" id='func'>{t('chooseFunc')}</option>
                                { FUNCTION_LIST.map((dt) => {
                                        return <option value={dt.value} name="func" id='func' key={dt.value}>{dt.name}</option>
                                })}
                            </NativeSelect>
                        </FormControl>
                        <ArrowForwardIcon id="update" onClick={handleSamplingChange}/>
                    </div>
                })}
            </div>
            }</NamespacesConsumer>
        )
    }
}

export default withStyles(styles)(DataProcessingComponent);