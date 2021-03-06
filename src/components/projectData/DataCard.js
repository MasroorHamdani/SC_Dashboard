import React, {Component} from 'react';

import {withStyles, Card, CardHeader,
    CardContent, Avatar} from '@material-ui/core';

import {getFormatedGraphData} from '../../utils/AnalyticsDataFormat';
import GraphPlot from '../../components/dataAnalysis/GraphPlot';

import styles from './ProjectDataStyle';

class DataCard extends Component{
    generateDataAnalytics = (dataAnalysis, metrics, classes, stateData) => {
        let analyticsData = getFormatedGraphData(dataAnalysis, metrics, stateData),
            graphData = analyticsData.graphData,
            nameMapper = analyticsData.nameMapper,
            metricToUse = analyticsData.metricToUse,
            tabData = <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metricToUse}
                        stateData={stateData} isDashboard={true}/>;
        return tabData;
    }
    render() {
        const {classes, row, stateData} = this.props;
        let tabData;
        if(row.dataAnalysis && row.dataAnalysis.metrics){
            tabData = this.generateDataAnalytics(row.dataAnalysis.metrics,
                row.allMetrics, classes, stateData);
        }
        return (
            <div className={classes.flexContainer} key={row.PID}>
                <Card className={classes.card}>
                    <CardHeader avatar={
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                        {row.PID ? row.PID.substr(0,1) : ''}
                        </Avatar>
                    }
                    title={row.Site}
                    subheader={row.Site_Addr}/>
                    <CardContent className={classes.content}>
                    {tabData}
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(DataCard);