const styles = theme => ({
    root: {
      // width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      // minWidth: 1020,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    searchSection: {
      display: 'flex',
      padding: theme.spacing.unit * 3,
    },
    searchField: {
      marginLeft: theme.spacing.unit * 2,
    },
    icon: {
      margin: theme.spacing.unit,
      fontSize: 32,
    },
    pointer: {
      cursor: 'pointer'
    },
    denseList: {
      paddingLeft: '0px'
    },
    deviceDisplay: {
      display: 'flex',
      flexWrap: 'wrap',
    }
  });

  export default styles;