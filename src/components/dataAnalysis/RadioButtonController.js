import React, { Component } from 'react';
import {withStyles, FormControl, Radio, RadioGroup, FormControlLabel,
    ListSubheader, List, ListItem, ListItemText, Collapse} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import styles from './RadioButtonStyle';
import { NamespacesConsumer } from 'react-i18next';

import {ANALYTICS_SUB_TABS} from '../../constants/Constant';

/**
 * Child component to handle the left nav,
 * which includes list and within list a group of Radio buttons.
 * Along with collapse functionality.
 * Need to pass the data to be displayed,
 * data with header content
 * handlechange function - which defined what actiuon to be done whenever an radio button is selected
 */
class RadioButtonComponent extends Component {
    state =({
        open: false,
    });
    handleClick = (index) => {
        this.setState(state => ({ [index]: !state[index] }));
    };
    handleClickDropDown = () => {
        this.setState(state => ({ open: !state.open }));
    };
    fetchData = () => {
        this.props.handleChange();
    }
    render(){
        const {classes, data, handleChange, projectList, handleSelect} = this.props;
        return(<NamespacesConsumer>
            {
            t=><List dense
                component="nav"
                className={classes.root}>
                <ListItem button onClick={event => handleSelect(ANALYTICS_SUB_TABS['ALERT']['key'])}>
                    <ListItemText primary={ANALYTICS_SUB_TABS['ALERT']['display']} />
                </ListItem>
                <ListItem button onClick={event => handleSelect(ANALYTICS_SUB_TABS['DISPENSER']['key'])}>
                    <ListItemText primary={ANALYTICS_SUB_TABS['DISPENSER']['display']} />
                </ListItem>
                <ListItem button onClick={this.handleClickDropDown}>
                    <ListItemText primary={ANALYTICS_SUB_TABS['INSTALLATION_DETAILS']['display']} />
                    {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {projectList &&
                            projectList.map((project, index) => {
                            return <div key={project.id}>
                                <ListItem button className={classes.nested}
                                    onClick={event => this.handleClick(index)}>
                                    <ListItemText primary={project.name} />
                                    {this.state[index] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={this.state[index]} timeout="auto" unmountOnExit>
                                    <List dense component="div" disablePadding>
                                        <ListItem button>
                                            <FormControl component="fieldset" className={classes.formControl}>
                                                <RadioGroup
                                                    aria-label={data.header}
                                                    name={data.header}
                                                    className={classes.group}
                                                    value={data.value}
                                                    onChange={handleChange}>
                                                    {project.devices &&
                                                        project.devices.map(function(key) {
                                                        return <FormControlLabel value={key.id} key={key.id} control={<Radio />} label={key.id} />
                                                    })}
                                                </RadioGroup>
                                            </FormControl>
                                        </ListItem>
                                    </List>
                                </Collapse>
                                </div>
                            })}
                        </List>
                    </Collapse>
                </List>
            }</NamespacesConsumer>
        )
    }
}
export default withStyles(styles)(RadioButtonComponent);