import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import _ from 'lodash';

import {TIME_LIST, AUTO_REFRESH_TIMEOUT} from '../../constants/Constant';
import DateRowComponent from './DateRowComponent';
import {getFormatedGraphData} from '../../utils/AnalyticsDataFormat';
import GraphPlot from './GraphPlot';
import CustomModal from '../modal/Modal';
import styles from './AnalysisDataStyle';


/**
 * Component to display Analytics details for a select Device to User
 * It will show graphical data to users.
 */
class AnalysisData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            barClick: false,
            customModalData: ''
        }
    }
    
    handleRefresh = () => {
    /**
     * Method for auto refresh or onclick refresh of the data
     */
        this.props.refreshData()
    }

    handleBarClick = (metricID) => {
    /**
     * Handling bar click. any bar which has a click function will call this API.
     */
        this.setState({ barClick: true }, function() {
            this.detailAnalytics(metricID)
        });
        // this.handleDateChange();
        
    }
    
    detailAnalytics = (metricID) => {
    /**
     * On clicking any bar in the graph, this function will be called.
     * This function will access the existing data and fetch the required one - the data for clicked metric
     * and pass that to a generic function to create data to display, which will be latter on passed to modal.
     */
        let metricsData = {[metricID]: this.props.stateData.dataAnalysis.data.data.metrics[metricID]},
            metricIndex = this.props.stateData.dataAnalysis.data.data.allMetrics.findIndex(p => p.metricID == metricID),
            metricDim = [];
            metricDim.push(this.props.stateData.dataAnalysis.data.data.allMetrics[metricIndex]);
        this.setState({customModalData: this.generateDataAnalytics(metricsData, metricDim, this.props.classes, true)})
    }
    handleClose = () => {
    /**
     * This function will close the modal opened while clicking on a bar
     */
        this.setState({ barClick: false });
    }

    componentDidMount() {
    /**
     * Set up the interval, for auto refresh of graph data.
     */
        setInterval((this.handleRefresh), AUTO_REFRESH_TIMEOUT);
    }

    generateDataAnalytics = (data, metrics, classes, isCustomModal=false) => {
    /**
     * Call the service to get the graph data and name mapper
     * for each graph to be display on a page
     * Once that is received, call the GraphPlot component 
     * with data and that will return the complete graph component.
     */
        let dataAnalysis = data,
            analyticsData = getFormatedGraphData(dataAnalysis, metrics, this.props.stateData),
            graphData = analyticsData.graphData,
            nameMapper = analyticsData.nameMapper, tabData;
            
            if(this.state.barClick) {
                tabData = <div className={classes.dispenserGraph}>
                    <DateRowComponent handleDatePicker={this.props.handleDatePicker}
                        handleChangeStart={this.props.handleChangeStart}
                        handleChangeEnd={this.props.handleChangeEnd}
                        handleListSelection={this.props.handleListSelection}
                        data={this.props.stateData}
                        timeList={TIME_LIST}/>
                    <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metrics}
                        stateData={this.props.stateData}
                        handleSamplingChange={this.props.handleSamplingChange}
                        handleBarClick={this.handleBarClick}
                        isCustomModal={isCustomModal}/>
                </div>;
            } else if(!tabData && !this.state.barClick)
                tabData = <GraphPlot graphData={graphData}
                    nameMapper={nameMapper} metrics={metrics}
                    stateData={this.props.stateData}
                    handleSamplingChange={this.props.handleSamplingChange}
                    handleBarClick={this.handleBarClick}/>;
        return tabData;
    }
    render() {
        const {classes, stateData, handleDatePicker,
            handleChangeStart, handleListSelection,
            handleChangeEnd} = this.props;
        let tabData;
        if (stateData.dataAnalysis && stateData.dataAnalysis.data && !this.state.barClick){
            tabData = this.generateDataAnalytics(stateData.dataAnalysis.data.data.metrics,
                stateData.dataAnalysis.data.data.allMetrics, classes, false);
        } else if(typeof(stateData.dataAnalysis) === 'string' && !this.state.barClick) {
            tabData = stateData.dataAnalysis;
        }
        return (
            <div className={classes.graph}>
            {stateData.deviceKey === stateData.tab &&
                <DateRowComponent handleDatePicker={handleDatePicker}
                    handleChangeStart={handleChangeStart}
                    handleChangeEnd={handleChangeEnd}
                    handleListSelection={handleListSelection}
                    data={stateData}
                    timeList={TIME_LIST}
                    handleRefresh={this.handleRefresh}
                />
            }
            <div className={classes.grapPlot}>
                {tabData}
            </div>
            <CustomModal
                header="Data Analytics Details"
                content={this.state.customModalData}
                handleClose={this.handleClose}
                open={this.state.barClick}
                />
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);