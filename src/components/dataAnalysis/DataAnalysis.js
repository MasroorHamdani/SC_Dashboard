import React, { Component } from 'react';
import {withStyles, AppBar, Tabs, Tab} from '@material-ui/core';
import styles from './DataAnalysisStyle';
import AnalysisData from './AnalysisData';
import {ANALYTICS_TAB} from '../../constants/Constant';

/**
 * It is s Child component which is in turn Parent Component with Tabs setup and
 * calling child component 'AnalysisData'
 * along with passing data to that which will be used to display graphs.
 * Data is passed as input from Parent container.
 */
class DataAnalysisComponent extends Component {
    render() {
        const {classes, stateData, handleDateChange,
            handleTabChange, handleSamplingChange,
            handleDatePicker, handleChangeStart,
            handleListSelection, handleChangeEnd} = this.props;
        return(
            <div className={classes.main}>
                <div>
                    <AppBar position="static" color="default">
                        <Tabs
                        scrollable
                        scrollButtons="auto"
                        value={stateData.tab}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                        >
                            {Object.keys(stateData.installationList).map((key)=> (
                                <Tab label={stateData.installationList[key]['text']}
                                    value={stateData.installationList[key]['key']}
                                    key={stateData.installationList[key]['key']}
                                    />
                            ))}
                            }
                        </Tabs>
                    </AppBar>

                    {stateData.tab &&
                        <AnalysisData 
                        handleDateChange={handleDateChange}
                        stateData={stateData} handleSamplingChange={handleSamplingChange}
                        handleDatePicker={handleDatePicker}
                        handleChangeStart={handleChangeStart}
                        handleListSelection={handleListSelection}
                        handleChangeEnd={handleChangeEnd}
                        />}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(DataAnalysisComponent);