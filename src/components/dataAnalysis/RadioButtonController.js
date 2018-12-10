import React, { Component } from 'react';
import {withStyles, FormControl, Radio, RadioGroup, FormLabel, FormControlLabel} from '@material-ui/core';
import styles from './RadioButtonStyle';

class RadioButtonComponent extends Component {
    render(){
        const {classes, menuList, data, handleChange} = this.props;
        return(
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" className={classes.legend}>{data.header}</FormLabel>
                <RadioGroup
                    aria-label={data.header}
                    name={data.header}
                    className={classes.group}
                    value={data.value}
                    onChange={handleChange}
                    >
                    {menuList.map(function(key) {
                        return <FormControlLabel value={key.name} key={key.id} control={<Radio />} label={key.name} />
                    })}
                </RadioGroup>
            </FormControl>
        )
    }
}
export default withStyles(styles)(RadioButtonComponent);