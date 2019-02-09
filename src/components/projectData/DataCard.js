import React, {Component} from 'react';

import {withStyles, Card, CardHeader, CardMedia,
    CardContent, Avatar, IconButton,
    Menu, MenuItem} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import styles from './ProjectDataStyle';
import {REACT_URLS} from '../../constants/Constant';

class DataCard extends Component{
    state = {
        anchorEl: null,
    };
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    render() {
        const {classes, projectActionRedirection, row} = this.props;
        const { anchorEl } = this.state;
        return (
            <div key={row.PID}>
                <Card className={classes.card}>
                    <CardHeader avatar={
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                        {row.PID.substr(0,1)}
                        </Avatar>
                    }
                    action={
                        <IconButton>
                        <MoreVertIcon onClick={this.handleClick}/>
                        </IconButton>
                    }
                    title={row.Site}
                    subheader={row.Site_Addr}/>
                    <CardMedia
                    className={classes.media}
                    title="Analytics"
                    image="../static/image.png"
                    />
                    <CardContent className={classes.pointer}>
                        <div>{row.name}</div>
                    </CardContent>
                </Card>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}>
                    <MenuItem value='alert' id={REACT_URLS['ALERT']}
                        onClick={e => projectActionRedirection(e, row.PID)}>Alert</MenuItem>
                    <MenuItem value='project_details' id={REACT_URLS['PROJECT_DETAILS']}
                        onClick={e => projectActionRedirection(e, row.PID)}>Project Details</MenuItem>
                </Menu>
            </div>
        )
    }
}

export default withStyles(styles)(DataCard);