import React, { Component } from 'react';
import {withStyles, ExpansionPanel, ExpansionPanelSummary,
    Typography, ExpansionPanelDetails, } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getFormatedDateTime} from '../../utils/DateFormat';

import styles from './DataAnalysisStyle';

class AlertAnalysis extends Component {
    render() {
        const {classes, data} = this.props;
        return (
            <div className={classes.root}>
            {data &&
                    data.map((row) => {
                        return (<ExpansionPanel>
                            {row.header &&
                                <ExpansionPanelSummary className={classes.header} expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>{row.header.StatusInfo.Reason}</Typography>
                                    <Typography>{row.header.StatusInfo.Status}</Typography>
                                    <Typography className={classes.heading}>
                                        {getFormatedDateTime(row.header.Timestamp, 'YYYY-MM')}
                                    </Typography>
                                </ExpansionPanelSummary>
                            }
                            {row.data.map((dt) => {
                                return<ExpansionPanelDetails>
                                    <Typography className={classes.heading}>
                                    {getFormatedDateTime(dt.Timestamp, 'YYYY-MM')}
                                    {dt.Data.Type}
                                    {dt.Data.Text}
                                    </Typography>
                                </ExpansionPanelDetails>
                            })}
                        </ExpansionPanel>)
                    })
            }
            </div>
        )
    }
}

export default withStyles(styles)(AlertAnalysis);