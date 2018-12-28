import React, { Component } from 'react';
import {withStyles, FormControl, Radio, RadioGroup, FormControlLabel,
    ListSubheader, List, ListItem, ListItemText, Collapse} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
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
    state =({});
    handleClick = (index) => {
        this.setState(state => ({ [index]: !state[index] }));
    };
    render(){
        const {classes, data, handleChange, projectList} = this.props;
        return(<NamespacesConsumer>
            {
            t=><List dense
                component="nav"
                subheader={<ListSubheader component="div">{t(data.header)}</ListSubheader>}
                className={classes.root}>
                {projectList.map((project, index) => {
                    return <div key={project.id}>
                        <ListItem button
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
            }</NamespacesConsumer>
        )
    }
}
export default withStyles(styles)(RadioButtonComponent);