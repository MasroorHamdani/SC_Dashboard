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
      name: "Project details",
      url: `/project/${pid}`,
      icon: "LibraryBooksIcon"
    },
    {
      name: "Data Analysis",
      url: "/data",
      icon: "BarChartIcon"
    },
    {
      name: "View Reports",
      url: `/report/${pid}`,
      icon: "AssignmentIcon"
    },
    {
      name: "Configure Report",
      url: "/report",
      icon: "SettingsIcon"
    },
    {
      name: "Health Status",
      url: `/health/${pid}`,
      icon: "FavoriteIcon"
    },
    {
      name: "Alert Data",
      url: `/alert/${pid}`,
      icon: "NotificationImportantIcon"
    }])
}