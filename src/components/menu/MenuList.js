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
      url: partnerId ? `/${partnerId}/data/project/${pid}` : `/data/project/${pid}`,
      icon: "BarChartIcon",
      toolTip: "Data Analysis"
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
    {
      name: "Add Project",
      url: partnerId ? `/${partnerId}/new` : `/new`,
      icon: "CreateIcon",
      toolTip: "Add Project"
    }
  ])
}