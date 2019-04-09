import red from '@material-ui/core/colors/red';
const styles = theme => ({
    card: {
      // maxWidth: 400,
      // height: '100%'
    },
    media: {
      // height: 10,
      // paddingTop: '56.25%', // 16:9
      // cursor: 'pointer'
    },
    content: {
      minHeight: 10,
      // paddingTop: '56.25%',
      display: 'flex'
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
      width: '100% !important'
    },
    seperator: {
      marginTop: theme.spacing.unit * 1,
      marginBottom: theme.spacing.unit * 2,
    }
});

export default styles