import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {withStyles, Card, CardHeader, CardMedia, CardContent, Avatar, IconButton} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import styles from "./ProjectDataStyle";

class ProjectDataComponent extends Component {

    render() {
        const { classes, data, onClick } = this.props;

        if(data) {
            const returnData = data.map((row,index) => {
                return(
                    <Card className={classes.card} onClick={e => onClick(e, row.key)} key={row.key}>
                        <CardHeader avatar={
                            <Avatar aria-label="Recipe" className={classes.avatar}>
                            P
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
                            <div>{row.key}</div>
                            <div>{row.site}</div>
                            <div>{row.site_addr}</div>
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