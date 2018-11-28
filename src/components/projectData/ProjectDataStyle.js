import red from '@material-ui/core/colors/red';
const styles = theme => ({
    card: {
      maxWidth: 400,
    },
    media: {
      height: 10,
      paddingTop: '56.25%', // 16:9
    },
    actions: {
      display: 'flex',
    },
    avatar: {
      backgroundColor: red[500],
    }
});

export default styles