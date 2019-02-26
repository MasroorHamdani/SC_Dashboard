import React, {Component} from 'react';
import { NamespacesConsumer } from 'react-i18next';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import {ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {Link} from "react-router-dom";

class ListItems extends Component {
    renderSwitch(param) {
        switch(param) {
            case 'DashboardIcon':
                return <DashboardIcon/>;
            case 'BarChartIcon':
                return <BarChartIcon/>;
            case 'NotificationImportant':
                return <NotificationImportantIcon/>
            case 'LibraryBooks':
                return <LibraryBooksIcon/>;
            case 'Assignment':
                return <AssignmentIcon/>;
            default:
                return '';
        }
      }
    render() {
        const {menuList} = this.props;
        if(menuList) {
            const menu = menuList.map((row,index) => {
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