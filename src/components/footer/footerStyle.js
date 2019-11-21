const styles = theme => ({
    appBar: {
      // color: "inherit",
        bottom: 0,
        top: 'auto',
        zIndex: theme.zIndex.drawer + 1,
        // background: `${theme.palette.primary.main}`,
      },
      title: {
        flexGrow: 1,
        textAlign: 'center',
        color: '#ffffff'
      }
});

export default styles;