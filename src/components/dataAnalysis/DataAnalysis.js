import React, { Component } from 'react';
import {withStyles, AppBar, Tabs, Tab} from '@material-ui/core';
import RadioButtonComponent from './RadioButtonController'

import styles from './DataAnalysisStyle';
import AnalysisData from './AnalysisData';

class DataAnalysisComponent extends Component {
    state = {
        value: 0,
    };
    handleChange = (event, value) => {
        this.setState({ value });
    };
    render() {
        const {classes, menuList, data, handleChange} = this.props;
        return(
            <div className={classes.root}>
                <main className={classes.content}>
                    <RadioButtonComponent menuList={menuList} data={data} handleChange={handleChange}/>
                    <div className={classes.seperator}></div>
                    <div className={classes.main}>
                    <AppBar position="static" color="default">
                        <Tabs
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
                        category="Alerts"/>}
                    {this.state.value === 1 && <AnalysisData 
                        category="NFC Logs"/>}
                    {this.state.value === 2 && <AnalysisData
                        category="Feedback Tablet"/>}
                    {this.state.value === 3 && <AnalysisData 
                        category="People counting sensor"/>}
                    {this.state.value === 4 && <AnalysisData
                        category="Air quality sensor"/>}
                    {this.state.value === 5 && <AnalysisData 
                        category="Wetness Detection sensor"/>}
                    </div>
                </main>
            </div>
        )
    }
}

export default withStyles(styles)(DataAnalysisComponent);