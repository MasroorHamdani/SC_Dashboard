import React, {Component} from 'react';

import { withStyles, Snackbar, SnackbarContent,
    IconButton} from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

import styles from './ModalStyle';

class CustomPopOver extends Component {
    /**
     * Generic PopOver to be used accross the Web App.
     */
    render() {
        const variantIcon = {
            success: CheckCircleIcon,
            warning: WarningIcon,
            error: ErrorIcon,
            info: InfoIcon,
        };
        const {content, open, variant, classes, handleClose} = this.props;
        const Icon = variantIcon[variant];
        return (<Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
            <SnackbarContent
                className={classes.error}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                        <Icon className={[classes.icon, classes.iconVariant]} />
                        {content}
                    </span>
                }
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon className={classes.icon} />
                    </IconButton>
                ]}/>
            </Snackbar>
        )
    }
}

export default withStyles(styles)(CustomPopOver);