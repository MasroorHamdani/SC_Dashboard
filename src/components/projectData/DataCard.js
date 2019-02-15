import React, {Component} from 'react';

import {withStyles, Card, CardHeader, CardMedia,
    CardContent, Avatar, IconButton,
    Menu, MenuItem} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import styles from './ProjectDataStyle';
import {REACT_URLS} from '../../constants/Constant';
import {getFormatedGraphData} from '../../utils/AnalyticsDataFormat';
import GraphPlot from '../../components/dataAnalysis/GraphPlot';

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
    generateDataAnalytics = (dataAnalysis, metrics, classes) => {
        let analyticsData = getFormatedGraphData(dataAnalysis, metrics),
            graphData = analyticsData.graphData,
            nameMapper = analyticsData.nameMapper,
            tabData = <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metrics}
                        classes={classes}
                        stateData={this.props.stateData}/>;
        return tabData;
    }
    render() {
        const {classes, projectActionRedirection, row} = this.props;
        const { anchorEl } = this.state;
        let tabData;
        if(row.dataAnalysis.metrics)
            tabData = this.generateDataAnalytics(row.dataAnalysis.metrics,
                row.allMetrics, classes);
        return (
            <div className={classes.flexContainer} key={row.PID}>
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
                    {/* <CardMedia
                    className={classes.media}
                    title="Analytics"
                    image="../static/image.png"
                    /> */}
                    <CardContent className={classes.content}>
                    {tabData}
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