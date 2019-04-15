export function mainMenuList (pid) {
  /**
   * Generate the left nav list, with pid being passsed to generate the URL
   */
return ([
    {
      name: "Dashboard",
      url: "/",
      icon: "DashboardIcon",
      toolTip: "Dashboard"
    },
    {
      name: "Project details",
      url: `/project/${pid}`,
      icon: "LibraryBooksIcon",
      toolTip: "Project details"
    },
    {
      name: "Data Analysis",
      url: `/data/project/${pid}`,
      icon: "BarChartIcon",
      toolTip: "Data Analysis"
    },
    {
      name: "Reports",
      url: `/report/project/${pid}`,
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
      url: `/health/project/${pid}`,
      icon: "FavoriteIcon",
      toolTip: "Health Status"
    },
    {
      name: "Alert Data",
      url: `/alert/project/${pid}`,
      icon: "NotificationImportantIcon",
      toolTip: "Alert Data"
    }])
}