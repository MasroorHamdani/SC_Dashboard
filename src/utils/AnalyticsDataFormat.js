import _ from 'lodash';
import moment from 'moment';
import {DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT} from '../constants/Constant';

export function getFormatedGraphData(passedData, metrics) {
    // console.log(passedData, metrics);
    let graphData = [], nameMapper = {};
    // flattedData = passedData.data;
    // flattedData.map(function(d) {
    //     let graphElement = {}
    //     graphElement['name'] = moment(d.t, DATE_TIME_FORMAT).format(GRAPH_LABEL_TIME_FORMAT);
    //     metrics['vector'].map((vec) => {
    //         graphElement[vec.shortName] = d[vec.path];
    //         nameMapper[vec.shortName] = {};
    //         nameMapper[vec.shortName]['name'] = vec.name;
    //         nameMapper[vec.shortName]['color'] = vec.color;
    //         nameMapper[vec.shortName]['chartType'] = vec.chartType;
    //     })
    //     graphData.push(graphElement)
    // });
    
    metrics.map(function(row) {
        let metridId = row.metricID;
        // console.log(passedData[metridId])
        Object.keys(passedData[metridId]).map((key, index) => {
            let graphSection = [];
            // console.log(key);
            passedData[metridId][key].data.map((vec) => {
                let graphElement = {};
                row.dimensions.map((dim) => {
                    
                    if(row.metricDataKey && row.metricDataKey === 't') {
                        graphElement['name'] = moment(vec.t, DATE_TIME_FORMAT).format(GRAPH_LABEL_TIME_FORMAT);
                    }
                    graphElement[dim.id] = vec[dim.key];
                    nameMapper[dim.id] = {};
                    nameMapper[dim.id]['name'] = dim.name;
                    nameMapper[dim.id]['color'] = dim.color;
                    nameMapper[dim.id]['chartType'] = dim.ctype;
                    
                })
                graphSection.push(graphElement)
            })
            graphData[metridId] = graphSection;
        })
        // console.log(graphData, nameMapper);
    })
    return {graphData: graphData,
        nameMapper: nameMapper
    }
}