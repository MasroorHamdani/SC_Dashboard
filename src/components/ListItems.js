import React, {Component} from 'react';
import { NamespacesConsumer } from 'react-i18next';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import PeopleIcon from '@material-ui/icons/People';
import {ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {Link} from "react-router-dom";
// import {DashboardIcon, BarChartIcon, LayersIcon, PeopleIcon} from '@material-ui/icons';

class ListItems extends Component {
    renderSwitch(param) {
        switch(param) {
            case 'DashboardIcon':
                return <DashboardIcon/>;
            case 'BarChartIcon':
                return <BarChartIcon/>;
            case 'LayersIcon':
                return <LayersIcon/>;
            case 'PeopleIcon':
                return <PeopleIcon/>
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
                            {/* <NamespacesConsumer> { */}
                                <ListItemText primary={row.name} />
                            {/* }</NamespacesConsumer> */}
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