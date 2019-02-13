import red from '@material-ui/core/colors/red';
const styles = theme => ({
    card: {
      maxWidth: 400,
      height: '100%'
    },
    media: {
      height: 10,
      paddingTop: '56.25%', // 16:9
      // cursor: 'pointer'
    },
    actions: {
      display: 'flex',
    },
    avatar: {
      backgroundColor: red[500],
    },
    pointer: {
      cursor: 'pointer'
    },
    flexContainer: {
      width: '100%'
    }
});

export default styles