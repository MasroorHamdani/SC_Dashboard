import {_, groupBy} from 'lodash';
import moment from 'moment-timezone';

import {DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT,
    METRIC_TYPE, ANALYTICS_DATE} from '../constants/Constant';

export function getFormatedGraphData(passedData, metrics) {
/**
 * Metrics data and metrics dimentions will be passed to this function
 * This function will first loop through the metrics dimentions
 * and based on metrics selected in loop, fetch the value from metrics data,
 * and process the data.
 * Validate the type of metrics, if it is Raw data, means some graph
 * else it is alert data - Being used on Dashboard.
 * For raw data, check if it is time series or categorical,
 * as both have different data format.
 * Also namemapper is being used in graph to set the name of the dimentions and color for them.
 * For alert data, format the data expected as per the component.
 * Next for graph type data, be it time series or categorical
 * Group the data per metric type, and combine them,
 * as in previous step there will be duplicate values,
 * grouping them will get ride of duplicate values.
 * Finally return the final data back to calling function
 */
    let graphData = [], nameMapper = {};
    metrics.map(function(row) {
        let metridId = row.metricID;
        let graphSection = [], mapper={};
            Object.keys(passedData[metridId]).map((key) => {
                row.dimensions.map((dim) => {
                    if(row.metricType !== METRIC_TYPE['RAW_DATA']) {
                        passedData[metridId][dim.id].data.map((vec) => {
                            if(row.metricType === METRIC_TYPE['TIMESERIES']) {
                                let graphElement = {};
                                if(row.metricDataKey && row.metricDataKey === 't') {
                                    graphElement['name'] = moment(vec.t, DATE_TIME_FORMAT).format(GRAPH_LABEL_TIME_FORMAT);
                                }
                                graphElement[dim.id] = vec[dim.key];
                                graphSection.push(graphElement)
                            } else if(row.metricType === METRIC_TYPE['CATEGORICAL']) {
                                let graphElement = {};
                                graphElement['name'] = dim.name;
                                graphElement['value'] = vec[dim.key];
                                graphElement['color'] = dim.color;
                                graphSection.push(graphElement)
                            }
                        })
                    } else {
                        const data = groupBy(passedData[metridId][dim.id].data.Items,'ID');
                        Object.keys(data).map((key, index) => {
                            let test = {};
                            test['data'] = [];
                            data[key].map((row) => {
                                if(row.SortKey.includes('status')) {
                                    test['header'] = row;
                                } else {
                                    test['data'].push(row);
                                }
                            })
                            graphSection.push(test)
                        })
                    }
                    mapper[dim.id] = {};
                    mapper[dim.id]['name'] = dim.name;
                    mapper[dim.id]['color'] = dim.color;
                    mapper[dim.id]['chartType'] = dim.ctype;
                })
                graphData[metridId] = graphSection;
                nameMapper[metridId] = mapper;
            })
        
        if(row.metricType !== METRIC_TYPE['RAW_DATA']) {
            let combinedValues = groupBy(graphData[metridId], 'name');
            let testData = [];
            Object.keys(combinedValues).map((key) => {
                if(key && key != 'undefined') {
                    let rowData = {};
                    rowData['name'] = key;
                    combinedValues[key].map((v) => {
                        Object.keys(v).map((k) => {
                            if (k !== 'name')
                                rowData[k] = v[k];
                        })
                    })
                    testData.push(rowData);
                }
            })
            if(testData.length > 0)
                graphData[metridId] = testData;
        }
    })
    return {graphData: graphData,
        nameMapper: nameMapper
    }
}


export function getStartEndTime(param='', startDate='', endDate='', timeZone='') {
/**
 * Function which will take param as input, which specifies No of hours,
 * startDate and End Date - In case of custom date time selection.
 * timezone - will be based on project.
 * depending on the value of param, the start and end datetime will be calculated,
 * In case it is custom, the passed start and end date will be used to format it and send back.
 */
    let now = moment(),
      start, end;
    if (param === ANALYTICS_DATE['ONE_HOUR']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 1})).tz(timeZone).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['THREE_HOUR']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 3})).tz(timeZone).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['TWELVE_HOUR']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 12})).tz(timeZone).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['ONE_DAY']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (now.subtract({ days: 1})).tz(timeZone).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['THREE_DAY']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (now.subtract({ days: 3})).tz(timeZone).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['ONE_WEEK']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (now.subtract({ weeks: 1})).tz(timeZone).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['CUSTOM']) {
      end = moment(endDate, DATE_TIME_FORMAT).tz(timeZone).format(DATE_TIME_FORMAT);
      start = moment(startDate, DATE_TIME_FORMAT).tz(timeZone).format(DATE_TIME_FORMAT);
    } else {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 1})).tz(timeZone).format(DATE_TIME_FORMAT);
    }
    return {
        'start': start,
        'end': end
    }
}

export function getVector(metricsResponse, deviceKey) {
/**
 * This function will get the metric deive data, for every analytics graph,
 * Format the data as per our requirement.
 * window - is combination of sampling and Unit returned and passed to API,
 * But on UI these are seperate, so for that have to get substring and assign to both fields.
 */
    let dataMetrics = {}, path = [], metric = {};
    metricsResponse.map((metrics) => {
        dataMetrics['metricType'] = metrics['metricType'];
        dataMetrics['name'] = metrics['metricName'];
        dataMetrics['vector'] = [];
        metric[metrics['metricID']] = {};
        path=[];
        metrics.dimensions.map((vector) => {
            let vec = {
                name: vector.name,
                path: vector.key,
                // unit: vector.Unit,
                shortName: vector.id,
                color: vector.color,
                statistic: vector.statistic,
                chartType: vector.ctype,
                showSamplingWidget: vector.showSamplingWidget,
                window: vector.window,
                sampling: vector.window.substr(0, vector.window.length-1) ? vector.window.substr(0, vector.window.length-1): 1,
                unit: vector.window.substr(vector.window.length-1, 1),
                type: deviceKey
            };
            dataMetrics['vector'].push(vec)
            if(vector.showSamplingWidget)
                path.push({[vector.id] : vec});
        })
        metric[metrics['metricID']] = path;
    })
    return {'dataMetrics': dataMetrics,
            'metric': metric}
}