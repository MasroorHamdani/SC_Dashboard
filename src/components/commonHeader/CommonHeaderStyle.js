const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    appBar: {
      background: `linear-gradient(0.25turn, #fff, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    },
    logo: {
      maxWidth: '20%',
      maxHeight: '43px'
    },
  });

  export default styles;