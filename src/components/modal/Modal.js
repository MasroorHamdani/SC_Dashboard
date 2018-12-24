import React, {Component} from 'react';
import styles from './ModalStyle';
import { withStyles } from '@material-ui/core/styles';
import {Button, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions} from '@material-ui/core';

class CustomModal extends Component {
    render() {
        const {classes, handleClose, handleClick, open, header,
            content} = this.props;
        return(
            <Dialog
                open={open}
                onClose={handleClose}
                scroll="paper"
                aria-describedby="alert-dialog-description"
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{header}</DialogTitle>
                <DialogContent id="responsive-dialog-description">
                    {/* <DialogContentText> */}
                    {content}
                    {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                    Cancel
                    </Button>
                    <Button onClick={handleClick} color="primary" autoFocus>
                    Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(CustomModal);