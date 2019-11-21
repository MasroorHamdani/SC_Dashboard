import React, {Component} from 'react';
import { NamespacesConsumer } from 'react-i18next';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SettingsIcon from '@material-ui/icons/Settings';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CreateIcon from '@material-ui/icons/CreateNewFolder';
import ListIcon from '@material-ui/icons/ViewList';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import ShowChartIcon from '@material-ui/icons/ShowChart'

import {ListItem, ListItemIcon, ListItemText, Tooltip,
    withStyles, Collapse, Divider, List} from '@material-ui/core';
import {Link} from "react-router-dom";

import styles from "./MenuStyle";

class ListItems extends Component {
    renderSwitch(param) {
        /**
         * This function is used to display the relevant icons for menu.
         * menu list will have the icon name give,
         * which we need to define here and use in switch case.
         */
        switch(param) {
            case 'DashboardIcon':
                return <DashboardIcon/>;
            case 'BarChartIcon':
                return <BarChartIcon/>;
            case 'NotificationImportantIcon':
                return <NotificationImportantIcon/>
            case 'LibraryBooksIcon':
                return <LibraryBooksIcon/>;
            case 'AssignmentIcon':
                return <AssignmentIcon/>;
            case 'SettingsIcon':
                return <SettingsIcon/>;
            case 'FavoriteIcon':
                return <FavoriteIcon/>;
            case 'CreateIcon':
                return <CreateIcon/>;
            case 'ListIcon':
                return <ListIcon/>;
            case 'DataUsageIcon':
                return <DataUsageIcon/>;
            case 'ShowChartIcon':
                return <ShowChartIcon/>
            default:
                return '';
        }
    }
    render() {
        const {menuList, classes,
            activeRoute, menuState, handleClick, open} = this.props;
        if(menuList) {
            const menu = menuList.map((row, index) => {
                const icon = row.icon;
                return (
                    <div>
                    <Tooltip title={!menuState ? row.toolTip : ''} key={index}>
                        <ListItem button component={!row.nestedMenu ? Link : ''}
                            to={!row.nestedMenu ? row.url: ''}
                            className={!row.nestedMenu ? activeRoute(row.url) ? classes.isActive: '' : ''}
                            onClick={row.nestedMenu ? handleClick: ''}>
                                <ListItemIcon className={classes.whiteFont}>
                                    {this.renderSwitch(icon)}
                                </ListItemIcon>
                            <NamespacesConsumer>
                            {
                                t=>
                                <ListItemText disableTypography={true} primary={t(row.name)} className={classes.textFontColor}/>
                            }
                            </NamespacesConsumer>
                            {row.nestedMenu ? open ? <IconExpandLess /> : <IconExpandMore /> : ''}
                        </ListItem>
                    </Tooltip>
                    {row.nestedMenu &&
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Divider />
                            <List component="div" disablePadding>
                                {row.submenu.map((innerRow, innerIndex) => {
                                    return <Tooltip title={innerRow.toolTip} key={innerIndex}>
                                        <ListItem button component={Link} to={innerRow.url}
                                            className={activeRoute(innerRow.url) ? classes.isActive: ''}>
                                            <ListItemIcon className={classes.whiteFont}>
                                                {this.renderSwitch(innerRow.icon)}
                                            </ListItemIcon>
                                            <ListItemText
                                            // inset
                                            disableTypography={true} primary={innerRow.name} className={classes.textFontColor}/>
                                        </ListItem>
                                    </Tooltip>
                                })}
                            </List>
                            <Divider />
                        </Collapse>
                        }
                    </div>
                )
            });
            return(
                <div>{menu}</div>
            )
        } else {
            return <div>No Menu</div>
        }
    }
}

export default withStyles(styles)(ListItems);