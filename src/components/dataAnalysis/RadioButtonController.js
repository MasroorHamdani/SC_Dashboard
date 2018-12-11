import React, { Component } from 'react';
import {withStyles, FormControl, Radio, RadioGroup, FormControlLabel,
    ListSubheader, List, ListItem, ListItemText, Collapse} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import styles from './RadioButtonStyle';

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
        dense: true
    })
    handleClick = () => {
        this.setState(state => ({ open: !state.open }));
    };
    render(){
        const {classes, data, handleChange, projectList} = this.props;
        const {dense, open} = this.state,
        handleClick = this.handleClick;
        return(
                <List dense={dense}
                component="nav"
                subheader={<ListSubheader component="div">{data.header}</ListSubheader>}
                className={classes.root}>
                {projectList.map(function(project) {
                    return <div key={project.id}>
                        <ListItem button onClick={handleClick} >
                            <ListItemText primary={project.name} />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List dense={dense} component="div" disablePadding>
                                <ListItem button>
                                    <FormControl component="fieldset" className={classes.formControl}>
                                        <RadioGroup
                                            aria-label={data.header}
                                            name={data.header}
                                            className={classes.group}
                                            value={data.value}
                                            onChange={handleChange}>
                                            {project.devices.map(function(key) {
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
        )
    }
}
export default withStyles(styles)(RadioButtonComponent);