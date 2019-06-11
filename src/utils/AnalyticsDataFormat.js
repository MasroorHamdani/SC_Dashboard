import {_, groupBy, orderBy, sortBy} from 'lodash';
import moment from 'moment-timezone';

import {DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT,
    METRIC_TYPE, ANALYTICS_DATE, GRAPH_LABEL_DATE_TIME_FORMAT,
    NAMESPACE_MAPPER, DATA_OPERATIONS} from '../constants/Constant';
import {formatDateTime, getTimeDifference,
    getTodaysStartDateTime} from '../utils/DateFormat';

export function getFormatedGraphData(passedData, metrics, stateData='', isCustomModal=false) {
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
    let graphData = [], nameMapper = {}, referenceMapper={};
    metrics.map(function(row) {
        let metridId = row.metric_id;//metricID;
        let graphSection = [], mapper={}, referenceLine={};
        Object.keys(passedData[metridId]).map((key) => {
            row.dimensions.map((dim) => {
                //metricType
                if(row.metric_type !== METRIC_TYPE['RAW_DATA']) {
                    passedData[metridId][dim.id].data.map((vec) => {
                        if(row.metric_type === METRIC_TYPE['TIMESERIES']) {
                            let graphElement = {};
                            if(row.metric_data_key && (row.metric_data_key === 't' || row.metric_data_key === 'AGG')) {
                                let timeDiffer = getTimeDifference(isCustomModal ? stateData.modalStart : stateData.start,
                                    isCustomModal ? stateData.modalEnd : stateData.end);
                                if(timeDiffer) {
                                    graphElement['name'] = formatDateTime(vec[row.metric_data_key], DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT)
                                    //moment(vec.t, DATE_TIME_FORMAT).format(GRAPH_LABEL_TIME_FORMAT);
                                } else {
                                    graphElement['name'] = formatDateTime(vec[row.metric_data_key], DATE_TIME_FORMAT, GRAPH_LABEL_DATE_TIME_FORMAT)
                                }
                            }
                            graphElement[dim.id] = vec[dim.key];
                            graphSection.push(graphElement)
                        } else if(row.metric_type === METRIC_TYPE['CATEGORICAL']) {
                            let graphElement = {};
                            graphElement['name'] = dim.name;
                            graphElement['value'] = vec[dim.key];
                            graphElement['color'] = dim.color;
                            graphSection.push(graphElement)
                        }
                    })
                } else if(stateData.projectLocationList) {
                    const data = groupBy(passedData[metridId][dim.id].data,'ID');
                    /**
                     * This part is specifically for alerts data.
                     * Mapping the location list name with locations ids
                     * To show on UI on Home page
                     */
                    let deviceResponse = stateData.projectLocationList, SUB1, SUB2;
                    deviceResponse.map((row) => {
                        SUB1 = NAMESPACE_MAPPER[row['NS']].SUB1;
                        SUB2 = NAMESPACE_MAPPER[row['NS']].SUB2;
                        row[SUB1] =  row.SUB1;
                        row[SUB2] = row.SUB2;
                    })
                    if(data) {
                        Object.keys(data).map((key, index) => {
                            let test = {};
                            test['data'] = [];
                            data[key].map((row) => {
                                deviceResponse.map((dt) => {
                                    if(dt.insid === row.InstallationID) {
                                        row.name = dt.name;
                                        row.locn = dt.locn;
                                    }
                                });
                                if(row.SortKey.includes('status')) {
                                    test['header'] = row;
                                } else {
                                    test['data'].push(row);
                                }
                            })
                            graphSection.push(test)
                        })
                    }
                }
                mapper[dim.id] = {};
                mapper[dim.id]['name'] = dim.name;
                mapper[dim.id]['color'] = dim.color;
                mapper[dim.id]['chartType'] = dim.ctype;
                referenceLine[dim.id] = {};
                if(dim.trendline_y)
                    referenceLine[dim.id] = {
                        'trendLineY' : dim.trendline_y,
                        'name': `Max - ${dim.name}`,
                        'color': dim.color
                    }
            })
            graphData[metridId] = orderBy(graphSection, 'header.Timestamp', 'desc');
            nameMapper[metridId] = mapper;
            referenceMapper[metridId] = referenceLine;
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
                graphData[metridId] = sortBy(testData,'name');//testData;
        }
    })
    return {graphData: graphData,
        nameMapper: nameMapper,
        referenceMapper: referenceMapper
    }
}


export function getStartEndTime(param='', startDate='', endDate='', timeZone='') {
/**
 * Function which will take param as input, which specifies No of hours,
 * startDate and End Date - In case of custom date time selection.
 * timezone - will be based on project.
 * depending on the value of param, the start and end datetime will be calculated,
 * In case it is custom, the passed start and end date will be used to format it and send back.
 * If nothing is passed by default set it to 24 hours, whcih is the default value.
 */
    let now = moment(),
      start, end, selectedIndex, startTime, endTime;
    if (param === ANALYTICS_DATE['ONE_HOUR']) {
        endTime = now.toDate();
        end = now.tz(timeZone).format(DATE_TIME_FORMAT);
        startTime = (moment().subtract({ hours: 1})).toDate();
        start = (moment().subtract({ hours: 1})).tz(timeZone).format(DATE_TIME_FORMAT);
        selectedIndex = 0;
    } else if(param === ANALYTICS_DATE['THREE_HOUR']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (moment().subtract({ hours: 3})).tz(timeZone).format(DATE_TIME_FORMAT);
      endTime = now.toDate();
      startTime = (moment().subtract({ hours: 3})).toDate();
      selectedIndex = 1;
    } else if(param === ANALYTICS_DATE['TWELVE_HOUR']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (moment().subtract({ hours: 12})).tz(timeZone).format(DATE_TIME_FORMAT);
      endTime = now.toDate();
      startTime = (moment().subtract({ hours: 12})).toDate();
      selectedIndex = 2;
    } else if(param === ANALYTICS_DATE['ONE_DAY']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (moment().subtract({ days: 1})).tz(timeZone).format(DATE_TIME_FORMAT);
      endTime = now.toDate();
      startTime = (moment().subtract({ days: 1})).toDate();
      selectedIndex = 3;
    } else if(param === ANALYTICS_DATE['THREE_DAY']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (moment().subtract({ days: 3})).tz(timeZone).format(DATE_TIME_FORMAT);
      endTime = now.toDate();
      startTime = (moment().subtract({ days: 3})).toDate();
      selectedIndex = 4;
    } else if(param === ANALYTICS_DATE['ONE_WEEK']) {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (moment().subtract({ weeks: 1})).tz(timeZone).format(DATE_TIME_FORMAT);
      endTime = now.toDate();
      startTime = (moment().subtract({ weeks: 1})).toDate();
      selectedIndex = 5;
    } else if(param === ANALYTICS_DATE['TODAY']) {
        end = now.tz(timeZone).format(DATE_TIME_FORMAT);
        start = formatDateTime(getTodaysStartDateTime(), DATE_TIME_FORMAT, DATE_TIME_FORMAT);
        endTime = now.toDate();
        startTime = getTodaysStartDateTime();
        selectedIndex = 6;
    } else if(param === ANALYTICS_DATE['CUSTOM']) {
      end = moment(endDate, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT);
      start = moment(startDate, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT);
      selectedIndex = -1;
    } else {
      end = now.tz(timeZone).format(DATE_TIME_FORMAT);
      start = (moment().subtract({ hours: 24})).tz(timeZone).format(DATE_TIME_FORMAT);
      endTime = now.toDate();
      startTime = (moment().subtract({ hours: 24})).toDate();
      selectedIndex = 3;
    }
    return {
        'start': start,
        'end': end,
        'selectedIndex': selectedIndex,
        'startTime': startTime,
        'endTime': endTime
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
        dataMetrics['metricType'] = metrics['metric_type'];
        dataMetrics['name'] = metrics['metric_name'];
        dataMetrics['vector'] = [];
        metric[metrics['metric_id']] = {};
        path=[];
        metrics.dimensions.map((vector) => {
            let vec = {
                name: vector.name,
                path: vector.key,
                shortName: vector.id,
                color: vector.color,
                chartType: vector.ctype,
                type: deviceKey
            }
            , actions = [];
            vector.actions.map((row) => {
                let action = {};
                action.type = row.type;
                if(row.type === DATA_OPERATIONS['FILTER'])
                    action.criteria = row.criteria;
                else if(row.type === DATA_OPERATIONS['RESAMPLER']) {
                    action.criteria = {};
                    action.criteria.statistic = row.criteria.agg;
                    action.criteria.window = row.criteria.rule;
                    action.criteria.sampling = row.criteria.rule.substr(0, row.criteria.rule.length-1) ? row.criteria.rule.substr(0, row.criteria.rule.length-1): 1;
                    action.criteria.unit = row.criteria.rule.substr(row.criteria.rule.length-1, 1);
                }
                actions.push(action);
            })
            vec.actions = actions;
            dataMetrics['vector'].push(vec);
            path.push({[vector.id] : vec});
        })
        metric[metrics['metric_id']] = path;
    })
    return {'dataMetrics': dataMetrics,
            'metric': metric}
}