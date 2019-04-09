const styles = theme => ({
    appBar: {
        bottom: 0,
        top: 'auto',
        zIndex: theme.zIndex.drawer + 1,
        background: '#68a554',
      // linear-gradient(to left top, #2196f3, #430089, #3f87a6, #ebf8e1, #000)
      },
      title: {
        flexGrow: 1,
        textAlign: 'center',
      }
});

export default styles;