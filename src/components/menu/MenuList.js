import {ROLES} from '../../constants/Constant';

export function mainMenuList (pid, partnerId) {
  /**
   * Generate the left nav list, with pid being passsed to generate the URL
   */
  return ([
      {
        name: "Dashboard",
        url: partnerId ? `/${partnerId}/`: "/",
        icon: "DashboardIcon",
        toolTip: "Dashboard"
      },
      {
        name: "Project details",
        url: partnerId ? `/${partnerId}/project/${pid}`: `/project/${pid}`,
        icon: "LibraryBooksIcon",
        toolTip: "Project details"
      },
      {
        name: "Data Analysis",
        nestedMenu: true,
        icon: "DataUsageIcon",
        toolTip: "Data Analysis",
        submenu: [{
          name: "By Location",
          url: partnerId ? `/${partnerId}/view/project/${pid}` : `/view/project/${pid}`,
          icon: "ShowChartIcon",
          toolTip: "By Location"
        },
        {
          name: "By Device",
          url: partnerId ? `/${partnerId}/data/project/${pid}` : `/data/project/${pid}`,
          icon: "BarChartIcon",
          toolTip: "By Device"
        }]
      },
      {
        name: "Reports",
        url: partnerId ? `/${partnerId}/report/project/${pid}` : `/report/project/${pid}`,
        icon: "AssignmentIcon",
        toolTip: "Reports"
      },
      // {
      //   name: "Configure Report",
      //   url: `/report/configure/project/${pid}`,
      //   icon: "SettingsIcon",
      //   toolTip: "Configure Report"
      // },
      {
        name: "Health Status",
        url: partnerId ? `/${partnerId}/health/project/${pid}` : `/health/project/${pid}`,
        icon: "FavoriteIcon",
        toolTip: "Health Status"
      },
      {
        name: "Alert Data",
        url: partnerId ? `/${partnerId}/alert/project/${pid}` : `/alert/project/${pid}`,
        icon: "NotificationImportantIcon",
        toolTip: "Alert Data"
      },
  ])
}

export function secondaryMenuList (role, partnerId) {
  let secondaryMenu = [];
  if (role === ROLES['SC_ADMIN']) {
    secondaryMenu.push({
      name: "List Project",
      url: partnerId ? `/${partnerId}/listproject` : `/listproject`,
      icon: "ListIcon",
      toolTip: "List Project"
    },
    {
      name: "Add Project",
      url: partnerId ? `/${partnerId}/newproject` : `/newproject`,
      icon: "CreateIcon",
      toolTip: "Add Project"
    })
  } else if(role === ROLES['PARTNER_ADMIN']) {
    secondaryMenu.push({
      name: "My Projects",
      url: partnerId ? `/${partnerId}/myproject` : `/myproject`,
      icon: "ListIcon",
      toolTip: "My Projects"
    },
    {
      name: "Add Project",
      url: partnerId ? `/${partnerId}/newproject` : `/newproject`,
      icon: "CreateIcon",
      toolTip: "Add Project"
    })
  } else if(role === ROLES['PROJECT_ADMIN']) {
    secondaryMenu.push({
      name: "Add Project",
      url: partnerId ? `/${partnerId}/newproject` : `/newproject`,
      icon: "CreateIcon",
      toolTip: "Add Project"
    })
  }
  return secondaryMenu
}
