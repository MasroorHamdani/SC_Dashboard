import {red, green} from '@material-ui/core/colors';
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
      display: 'flex',
      flexWrap: 'wrap'
    },
    actions: {
      display: 'flex',
    },
    avatar: {
      backgroundColor: `${theme.palette.primary.main}`,
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
    },
    topPadding: {
      paddingTop: theme.spacing.unit * 4
    }
});

export default styles