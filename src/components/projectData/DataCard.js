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
        const {classes, projectActionRedirection, onClick, row} = this.props;
        const { anchorEl } = this.state;
        return (
            <div key={row.pid}>
                <Card className={classes.card}>
                    <CardHeader avatar={
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                        {row.pid.substr(0,1)}
                        </Avatar>
                    }
                    action={
                        <IconButton>
                        <MoreVertIcon onClick={this.handleClick}/>
                        </IconButton>
                    }
                    title="Project Details"
                    subheader="November 26, 2018"/>
                    <CardMedia onClick={e => onClick(e, row.pid)}
                    className={classes.media}
                    title="Analytics"
                    image="../static/image.png"
                    />
                    <CardContent className={classes.pointer}
                        onClick={e => onClick(e, row.pid)}>
                        <div>{row.name}</div>
                    </CardContent>
                </Card>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}>
                    <MenuItem value='alert' id={REACT_URLS['ALERT']}
                        onClick={e => projectActionRedirection(e, row.pid)}>Alert</MenuItem>
                    <MenuItem value='dispenser' id={REACT_URLS['DISPENSER']}
                        onClick={e => projectActionRedirection(e, row.pid)}>Dispenser</MenuItem>
                </Menu>
            </div>
        )
    }
}

export default withStyles(styles)(DataCard);