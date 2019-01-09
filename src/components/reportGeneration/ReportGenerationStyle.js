import red from '@material-ui/core/colors/red';
const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 8,
        height: '100vh',
        overflow: 'auto',
    },
    tabContent: {
        padding: theme.spacing.unit * 3,
    },
    card: {
        maxWidth: 400,
        minWidth: 400,
        margin: theme.spacing.unit * 2,
    },
    avatar: {
        backgroundColor: red[500],
        width: 60,
        height: 60,
    },
    gridRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        padding: theme.spacing.unit * 3,
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '100%',
        justifyContent: 'space-around',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    column: {
        flexBasis: '33.33%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
      },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    flexList: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '100%'
    },
    listItem: {
        width: '25%',
        wordBreak: 'break-word'
    },
    gridFooter: {
        marginTop: theme.spacing.unit
    },
    seperator: {
        marginTop: theme.spacing.unit * 3
    }

});

export default styles;
