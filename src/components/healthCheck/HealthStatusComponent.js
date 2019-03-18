import React, {Component} from 'react';

import {withStyles, Typography, Paper,
    AppBar, Tabs, Tab, Avatar} from '@material-ui/core';

import toiletpaper from '../../images/toilet-paper.png';
import peopleCounter from '../../images/people-counter.png';
import airQuality from '../../images/air-quality.png';
import wetnessDetection from '../../images/wetness-detection.png';
import gatewayDevice from '../../images/wetness-detection.jpg';
import styles from './HealthCheckStyle';

class HealthStatusComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
          value: 'team',
        };
    }
    render() {
        const {classes, stateData} = this.props;
        console.log(stateData.formattedData);
        return(
            <div className={classes.root}>
                {stateData.name &&
                    <main className={classes.content}>
                    <Paper style={{ padding: 8 * 3 }}>
                        <div><Typography>{stateData.name}</Typography><Typography>{stateData.locn}</Typography></div>
                        <AppBar position="static" color="default">
                            <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            >
                            {Object.keys(stateData.formattedData).map((key) => {
                                let image = '';
                                if (key === 'PC') {
                                    image = peopleCounter;
                                } else if(key === 'AQ') {
                                    image = airQuality;
                                } else if(key === 'PT') {
                                    image = toiletpaper;
                                } else if(key === 'WD') {
                                    image = wetnessDetection;
                                } else if(key === 'GW') {
                                    image = gatewayDevice;
                                }
                                return <Tab label={<Avatar alt={key} src={image} className={classes.bigAvatar}/>} 
                                value={key}/>
                            })}
                            </Tabs>
                        </AppBar>
                    </Paper>
                    </main>
                }
            </div>
        )
    }
}

export default withStyles(styles)(HealthStatusComponent);