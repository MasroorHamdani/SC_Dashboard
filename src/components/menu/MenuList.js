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
      name: "Data View",
      url: partnerId ? `/${partnerId}/view/project/${pid}` : `/view/project/${pid}`,
      icon: "BarChartIcon",
      toolTip: "Data View"
    },
    {
      name: "Data Analytics",
      url: partnerId ? `/${partnerId}/data/project/${pid}` : `/data/project/${pid}`,
      icon: "BarChartIcon",
      toolTip: "Data Analytics"
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

export function secondaryMenuList (pid, partnerId) {
  return ([
    {
      name: "List Project",
      url: partnerId ? `/${partnerId}/listproject` : `/listproject`,
      icon: "ListIcon",
      toolTip: "List Project"
    },
    {
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
    }
  ])
}