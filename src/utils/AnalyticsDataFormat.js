import {_, groupBy} from 'lodash';
import moment from 'moment';
import {DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT,
    METRIC_TYPE, ANALYTICS_DATE} from '../constants/Constant';

export function getFormatedGraphData(passedData, metrics) {
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
            let combinedValues = groupBy(graphData[metridId], 'name');//_.groupBy(graphData[metridId], 'name');
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


export function getStartEndTime(param='', startDate='', endDate='') {
    let now = moment(),
      start, end;
    if (param === ANALYTICS_DATE['ONE_HOUR']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 1})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['THREE_HOUR']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 3})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['TWELVE_HOUR']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 12})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['ONE_DAY']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ days: 1})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['THREE_DAY']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ days: 3})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['ONE_WEEK']) {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ weeks: 1})).format(DATE_TIME_FORMAT);
    } else if(param === ANALYTICS_DATE['CUSTOM']) {
      end = moment(endDate, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT);
      start = moment(startDate, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT);
    } else {
      end = now.format(DATE_TIME_FORMAT);
      start = (now.subtract({ hours: 1})).format(DATE_TIME_FORMAT);
    }
    return {
        'start': start,
        'end': end
    }
}

export function getVector(metricsResponse, deviceKey) {
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