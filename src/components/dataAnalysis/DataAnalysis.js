import React, { Component } from 'react';
import {withStyles, AppBar, Tabs, Tab} from '@material-ui/core';

import styles from './DataAnalysisStyle';
import AnalysisData from './AnalysisData';

/**
 * It is s Child component which is in turn Parent Component with Tabs setup and
 * calling child component 'AnalysisData'
 * along with passing data to that which will be used to display graphs.
 * Data is passed as input from Parent container.
 */
class DataAnalysisComponent extends Component {
    state = {
        value: 4,
    };
    handleChange = (event, value) => {
        this.setState({ value });
    };
    render() {
        const {classes, data, stateData, handleDateChange} = this.props;
        return(
                <div className={classes.main}>
                <AppBar position="static" color="default">
                    <Tabs
                    scrollable
                    scrollButtons="auto"
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                    >
                    <Tab label="Alerts" />
                    <Tab label="NFC Logs" />
                    <Tab label="Feedback Tablet" />
                    <Tab label="People counting sensor" />
                    <Tab label="Air quality sensor" />
                    <Tab label="Wetness Detection sensor" />
                    </Tabs>
                </AppBar>
                
                {this.state.value === 0 && <AnalysisData
                    category="Alerts" data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {this.state.value === 1 && <AnalysisData 
                    category="NFC Logs" data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {this.state.value === 2 && <AnalysisData
                    category="Feedback Tablet" data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {this.state.value === 3 && <AnalysisData 
                    category="People counting sensor" data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {(this.state.value === 4  || stateData.category.includes('AQ'))&& <AnalysisData
                    category="Air quality sensor" data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                {this.state.value === 5 && <AnalysisData 
                    category="Wetness Detection sensor" data={data} handleDateChange={handleDateChange}
                    stateData={stateData}/>}
                </div>
        )
    }
}

export default withStyles(styles)(DataAnalysisComponent);