import React, {Component} from 'react';
import { NamespacesConsumer } from 'react-i18next';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SettingsIcon from '@material-ui/icons/Settings';

import {ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {Link} from "react-router-dom";

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
                return <SettingsIcon/>
            default:
                return '';
        }
    }
    render() {
        const {menuList} = this.props;
        if(menuList) {
            const menu = menuList.map((row, index) => {
                const icon = row.icon;
                return (
                    <ListItem button component={Link} to={row.url} key={index}>
                        <ListItemIcon>
                            {this.renderSwitch(icon)}
                        </ListItemIcon>
                        <NamespacesConsumer>
                        {
                            t=><ListItemText primary={t(row.name)} />
                        }
                        </NamespacesConsumer>
                    </ListItem>
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

export default ListItems;