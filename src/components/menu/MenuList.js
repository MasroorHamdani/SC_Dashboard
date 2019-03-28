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
      url: `/data/project/${pid}`,
      icon: "BarChartIcon"
    },
    {
      name: "View Reports",
      url: `/report/project/${pid}`,
      icon: "AssignmentIcon"
    },
    {
      name: "Configure Report",
      url: "/report",
      icon: "SettingsIcon"
    },
    {
      name: "Health Status",
      url: `/health/project/${pid}`,
      icon: "FavoriteIcon"
    },
    {
      name: "Alert Data",
      url: `/alert/project/${pid}`,
      icon: "NotificationImportantIcon"
    }])
}