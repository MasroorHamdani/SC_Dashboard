import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {withStyles, Card, CardHeader, CardMedia, CardContent, Avatar, IconButton} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import styles from "./ProjectDataStyle";

class ProjectDataComponent extends Component {

    render() {
        const { classes, data, onClick } = this.props;

        if(data && data.Projects) {
            const newData  =data.Projects;
            const returnData = newData.map((row,index) => {
                return(
                    <Card className={classes.card} onClick={e => onClick(e, row.pid)} key={row.pid}>
                        <CardHeader avatar={
                            <Avatar aria-label="Recipe" className={classes.avatar}>
                            {row.pid.substr(0,1)}
                            </Avatar>
                        }
                        action={
                            <IconButton>
                            <MoreVertIcon />
                            </IconButton>
                        }
                        title="Project Details"
                        subheader="November 26, 2018"/>
                        <CardMedia
                        className={classes.media}
                        title="Analytics"
                        image="../static/image.png"
                        />
                        <CardContent>
                            <div>{row.name}</div>
                            <div>{row.pid}</div>
                            <div>{row.status}</div>
                        </CardContent>

                    </Card>
                );
            });
            return (
                <div className="flex-container">{returnData}</div>
            );
        } else {
            return <div className="flex-container">No Data</div>
        }
    }   
}
ProjectDataComponent.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ProjectDataComponent);