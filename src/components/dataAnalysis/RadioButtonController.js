import React, { Component } from 'react';
import {withStyles, FormControl, Radio, RadioGroup, FormControlLabel,
    List, ListItem} from '@material-ui/core';
import styles from './RadioButtonStyle';
import { NamespacesConsumer } from 'react-i18next';

/**
 * Child component to handle the left nav,
 * which includes list and within list a group of Radio buttons.
 * Along with collapse functionality.
 * Need to pass the data to be displayed,
 * data with header content
 * handlechange function - which defined what actiuon to be done whenever an radio button is selected
 */
class RadioButtonComponent extends Component {
    fetchData = () => {
        this.props.handleChange();
    }
    render(){
        const {classes, data, handleChange} = this.props;
        return(<NamespacesConsumer>
            {
            t=><List dense
                component="nav"
                className={classes.root}>
                    {data.projectList &&
                        data.projectList.map((project, index) => {
                        return <div key={project.id}>
                            <ListItem button key={index}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <RadioGroup
                                        aria-label={data.header}
                                        name={data.header}
                                        className={classes.group}
                                        value={data.value}
                                        >
                                        {project.devices &&
                                            project.devices.map(function(key) {
                                                let name = `${key.name} (${key.locn})`
                                            return <FormControlLabel value={key.insid} key={key.insid}
                                            control={<Radio 
                                                onChange={event => handleChange(event, project.name, key.insid)}/>}
                                                label={name} />
                                        })}
                                    </RadioGroup>
                                </FormControl>
                            </ListItem>
                        </div>
                    })}
                </List>
            }</NamespacesConsumer>
        )
    }
}
export default withStyles(styles)(RadioButtonComponent);