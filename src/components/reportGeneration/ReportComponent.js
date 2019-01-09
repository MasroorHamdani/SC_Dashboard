import React, { Component } from 'react';
import { Grid, TextField, FormControlLabel,
    Switch} from '@material-ui/core';
import {FIELD_TYPE} from '../../constants/Constant';

class ReportComponent extends Component {
    render() {
        const {index, value, disp, format, stateData, onChange,
            type} = this.props
        return (
            <Grid item xs={12} sm={6} key={index}>
                {type === FIELD_TYPE['STRING'] &&
                    <TextField
                    required
                    id={value}
                    name={value}
                    label={`${disp} - ${format}`} 
                    fullWidth
                    autoComplete={value}
                    value={stateData[value]}
                    onChange={onChange}/>
                }
                {type === FIELD_TYPE['BOOLEAN'] &&
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
                }
            </Grid>
        )
    }
}

export default ReportComponent;