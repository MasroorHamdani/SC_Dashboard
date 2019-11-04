const styles = theme => ({
    formControl: {
        // margin: theme.spacing.unit * 3,
        // border: "#b1afaf",
        // borderStyle: "solid",
        // borderWidth: "thin",
    },
    group: {
        // margin: theme.spacing.unit * 1,
        padding: theme.spacing.unit * 1,
    },
    root: {
        width: "21%",//'251px',//"23%",
        maxWidth: 360,
        wordBreak: 'break-word',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        position: 'relative',
        maxHeight: 'auto',
        // marginLeft: -theme.spacing.unit * 5,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
})

export default styles;
