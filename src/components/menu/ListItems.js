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

import {ListItem, ListItemIcon, ListItemText, Tooltip, withStyles} from '@material-ui/core';
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
            default:
                return '';
        }
    }
    render() {
        const {menuList, classes,
            activeRoute, menuState} = this.props;
        if(menuList) {
            const menu = menuList.map((row, index) => {
                const icon = row.icon;
                return (
                    <Tooltip title={!menuState ? row.toolTip : ''} key={index}>
                        <ListItem button component={Link} to={row.url}
                            className={activeRoute(row.url) ? classes.isActive: ''}>
                            
                                <ListItemIcon>
                                    {this.renderSwitch(icon)}
                                </ListItemIcon>
                            <NamespacesConsumer>
                            {
                                t=>
                                <ListItemText primary={t(row.name)} />
                            }
                            </NamespacesConsumer>
                        </ListItem>
                    </Tooltip>
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