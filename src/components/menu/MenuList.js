export function mainMenuList (pid) {
  /**
   * Generate the left nav list, with pid being passsed to generate the URL
   */
return ([
    {
      name: "Dashboard",
      url: "/",
      icon: "DashboardIcon"
    },
    {
      name: "Data Analysis",
      url: "/data",
      icon: "BarChartIcon"
    },
    {
      name: "Configure Report",
      url: "/report",
      icon: "SettingsIcon"
    },
    {
      name: "View Reports",
      url: `/report/${pid}`,
      icon: "AssignmentIcon"
    },
    {
      name: "Alert Data",
      url: `/alert/${pid}`,
      icon: "NotificationImportantIcon"
    },
    {
      name: "Project details",
      url: `/project/${pid}`,
      icon: "LibraryBooksIcon"
    }])
}