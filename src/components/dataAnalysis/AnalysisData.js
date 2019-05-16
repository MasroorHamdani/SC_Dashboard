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
        this.setState({ barClick: true, selectedMetric: metricID}, function() {
            this.props.getModalAnalyticsData();
        });
    }

    handleClose = () => {
    /**
     * This function will close the modal opened while clicking on a bar
     */
        this.setState({ barClick: false});
    }

    fetchModalData = (isString) => {
    /**
     * On clicking any bar in the graph, this function will be called internally.
     * This function will access the existing data and fetch the required one - the data for clicked metric
     * and pass that to a generic function to create data to display, which will be latter on passed to modal.
     */
        if(!isString) {
            let metricsData = {
                [this.state.selectedMetric]:
                this.props.stateData.modalDataAnalysis.data.data.metrics[this.state.selectedMetric]
            },
            metricIndex = this.props.stateData.modalDataAnalysis.data.data.all_metrics.findIndex(p =>
                p.metric_id == this.state.selectedMetric),
            metricDim = [];
            metricDim.push(this.props.stateData.modalDataAnalysis.data.data.all_metrics[metricIndex]);
            return this.generateDataAnalytics(metricsData, metricDim, this.props.classes, true);
        } else {
            return this.generateDataAnalytics('', '', this.props.classes, true, isString);
        }
        
    }

    componentDidMount() {
    /**
     * Set up the interval, for auto refresh of graph data.
     */
        setInterval((this.handleRefresh), AUTO_REFRESH_TIMEOUT);
    }

    generateDataAnalytics = (data, metrics, classes, isCustomModal=false, isString=false) => {
    /**
     * Call the service to get the graph data and name mapper
     * for each graph to be display on a page
     * Once that is received, call the GraphPlot component 
     * with data and that will return the complete graph component.
     */
        let tabData;
        if(!isString) {
            let dataAnalysis = data,
                analyticsData = getFormatedGraphData(dataAnalysis, metrics, this.props.stateData, isCustomModal),
                graphData = analyticsData.graphData,
                nameMapper = analyticsData.nameMapper;
                
                if(this.state.barClick && isCustomModal) {
                    tabData = <div className={classes.dispenserGraph}>
                        <DateRowComponent handleDatePicker={this.props.handleDatePicker}
                            modalHandleChangeStart={this.props.modalHandleChangeStart}
                            modalHandleChangeEnd={this.props.modalHandleChangeEnd}
                            handleListSelection={this.props.handleListSelection}
                            data={this.props.stateData}
                            timeList={TIME_LIST}
                            isCustomModal={isCustomModal}/>
                        <GraphPlot graphData={graphData}
                            nameMapper={nameMapper} metrics={metrics}
                            stateData={this.props.stateData}
                            handleSamplingChange={this.props.handleSamplingChange}
                            handleBarClick={this.handleBarClick}
                            isCustomModal={isCustomModal}/>
                    </div>;
                } else if(!tabData)
                    tabData = <GraphPlot graphData={graphData}
                        nameMapper={nameMapper} metrics={metrics}
                        stateData={this.props.stateData}
                        handleSamplingChange={this.props.handleSamplingChange}
                        handleBarClick={this.handleBarClick}/>;
        } else {
            if(this.state.barClick && isCustomModal) {
                tabData = <div className={classes.dispenserGraph}>
                    <DateRowComponent handleDatePicker={this.props.handleDatePicker}
                    modalHandleChangeStart={this.props.modalHandleChangeStart}
                    modalHandleChangeEnd={this.props.modalHandleChangeEnd}
                    handleListSelection={this.props.handleListSelection}
                    data={this.props.stateData}
                    timeList={TIME_LIST}
                    isCustomModal={isCustomModal}/>
                    {this.props.stateData.modalDataAnalysis}
                </div>
            }
        }
        return tabData;
    }
    render() {
        const {classes, stateData, handleDatePicker,
            handleChangeStart, handleListSelection,
            handleChangeEnd} = this.props;
        let tabData, customModalData = <div className={classes.modalIniatialDimentions}></div>;
        if (stateData.dataAnalysis && stateData.dataAnalysis.data){
            tabData = this.generateDataAnalytics(stateData.dataAnalysis.data.data.metrics,
                stateData.dataAnalysis.data.data.all_metrics, classes, false);
        } else if(typeof(stateData.dataAnalysis) === 'string' && !this.state.barClick) {
            tabData = stateData.dataAnalysis;
        }
        if (stateData.modalDataAnalysis && stateData.modalDataAnalysis.data  && this.state.barClick) {
            customModalData = this.fetchModalData();
        } else if(typeof(stateData.modalDataAnalysis) === 'string' && this.state.barClick) {
            customModalData = this.fetchModalData(true);
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
                    isCustomModal={false}
                />
            }
            <div className={classes.grapPlot}>
                {tabData}
            </div>
            <CustomModal
                header="Data Analytics Details"
                content={customModalData}
                handleClose={this.handleClose}
                open={this.state.barClick}
                fullWidth={true}
                />
            </div>
        )
    }
}

export default withStyles(styles)(AnalysisData);