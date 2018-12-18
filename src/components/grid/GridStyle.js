import { FormHelperText } from "@material-ui/core";

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
    },
    table: {
      minWidth: 1020,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    searchSection: {
      display: "flex",
      padding: theme.spacing.unit * 3,
    },
    searchField: {
      marginLeft: theme.spacing.unit * 2,
    },
    icon: {
      margin: theme.spacing.unit,
      fontSize: 32,
    },
  });

  export default styles;