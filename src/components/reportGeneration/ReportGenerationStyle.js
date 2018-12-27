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
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    collapse: {
        marginTop: theme.spacing.unit * -6
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
    
});

export default styles;
