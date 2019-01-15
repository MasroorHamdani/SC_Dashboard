const styles = theme => ({
    appBar: {
        bottom: 0,
        top: 'auto',
        zIndex: theme.zIndex.drawer + 1,
        // background: 'linear-gradient(0.25turn, #fff, #6577de, #3f51b5)',
      // linear-gradient(to left top, #2196f3, #430089, #3f87a6, #ebf8e1, #000)
      },
      title: {
        flexGrow: 1,
        textAlign: 'center',
      }
});

export default styles;