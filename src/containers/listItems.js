import React from 'react';

import {ListItem, ListItemIcon, ListItemText, ListSubheader} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { NamespacesConsumer } from 'react-i18next';
import { Link} from "react-router-dom";

export const mainListItems = (
  <NamespacesConsumer>
  {
   t=> <div>
      <ListItem button component={Link} to='/'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary={t("Dashboard")} />
      </ListItem>
      <ListItem button component={Link} to='/Logout'>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary={t("Logout")} />
      </ListItem>
      <ListItem button component={Link} to='/Contact'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary={t("Contact")} />
      </ListItem>
      <ListItem button component={Link} to='/Report'>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary={t("Reports")} />
      </ListItem>
      <ListItem button component={Link} to='/About'>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary={t("About")} />
      </ListItem>
    </div>
    }
    </NamespacesConsumer>
  
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);