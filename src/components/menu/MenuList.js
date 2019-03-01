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
      name: "Reports",
      url: "/report",
      icon: "Assignment"
    },
    {
      name: "Alert Data",
      url: `/alert/${pid}`,
      icon: "NotificationImportant"
    },
    {
      name: "Project details",
      url: `/project/${pid}`,
      icon: "LibraryBooks"
    }])
}