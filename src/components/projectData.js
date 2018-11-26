import React, { Component } from 'react';
import "./../sass/App.css";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
    card: {
      maxWidth: 400,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    actions: {
      display: 'flex',
    },
    avatar: {
      backgroundColor: red[500],
    }
  });

class ProjectDataComponent extends Component {

    render() {
        const { classes } = this.props;
        if(this.props.data) {
            const data = this.props.data.map((row,index) => {
                return(
                    // <div key={row.key} className="box" onClick={this.props.onClick}>
                    //     <div>{row.key}</div>
                    //     <div>{row.site}</div>
                    //     <div>{row.site_addr}</div>
                    //     {/* <div>No of alerts: {row.alertNumber}</div>
                    //     <div>Over time: {row.alertOverTime}hr</div> */}
                    // </div>
                    <Card className={classes.card} onClick={this.props.onClick}>
                <CardHeader
                avatar={
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
                />
                <CardContent>
                    <Typography component="p">
                    <div>{row.key}</div>
                    <div>{row.site}</div>
                    <div>{row.site_addr}</div>
                    </Typography>
                </CardContent>

            </Card>
                );
            });
            return (
            <div className="flex-container">{data}</div>);
            // <Card className={classes.card} onClick={this.props.onClick}>
            //     <CardHeader
            //     avatar={
            //         <Avatar aria-label="Recipe" className={classes.avatar}>
            //         R
            //         </Avatar>
            //     }
            //     action={
            //         <IconButton>
            //         <MoreVertIcon />
            //         </IconButton>
            //     }
            //     title="Project Details"
            //     subheader="Nob=vember 26, 2018"/>
            //     <CardContent>
            //         <Typography component="p">
            //             {data}
            //         </Typography>
            //     </CardContent>

            // </Card>);
        } else {
            return <div className="flex-container">No Data</div>
        }
    }   
}
ProjectDataComponent.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ProjectDataComponent);