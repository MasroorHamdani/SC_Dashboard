import React, {Component} from 'react';
import { NamespacesConsumer } from 'react-i18next';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBox from '@material-ui/icons/AccountBox';
import {ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {Link} from "react-router-dom";

class ListItems extends Component {
    renderSwitch(param) {
        switch(param) {
            case 'DashboardIcon':
                return <DashboardIcon/>;
            case 'BarChartIcon':
                return <BarChartIcon/>;
            case 'LayersIcon':
                return <LayersIcon/>;
            case 'ExitToAppIcon':
                return <ExitToAppIcon/>
            case 'AccountBox':
                return <AccountBox/>;
            default:
            return 'foo';
        }
      }
    render() {
        const MenuList = this.props.data;
        if(MenuList) {
            const menu = MenuList.map((row,index) => {
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