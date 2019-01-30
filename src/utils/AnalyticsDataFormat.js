import _ from 'lodash';
import moment from 'moment';
import {DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT,
    METRIC_TYPE} from '../constants/Constant';

export function getFormatedGraphData(passedData, metrics) {
    let graphData = [], nameMapper = {};
    metrics.map(function(row) {
        let metridId = row.metricID;
        let graphSection = [], mapper={};
        
            Object.keys(passedData[metridId]).map((key) => {
                row.dimensions.map((dim) => {
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
                    mapper[dim.id] = {};
                    mapper[dim.id]['name'] = dim.name;
                    mapper[dim.id]['color'] = dim.color;
                    mapper[dim.id]['chartType'] = dim.ctype;
                })
                graphData[metridId] = graphSection;
                nameMapper[metridId] = mapper;
            })
        
        
        let combinedValues = _.groupBy(graphData[metridId], 'name');
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
    })
    return {graphData: graphData,
        nameMapper: nameMapper
    }
}