import _ from 'lodash';
import moment from 'moment';
import {DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT} from '../constants/Constant';

export function getFormatedGraphData(passedData, metrics) {
    let graphData = [], nameMapper = {},
    flattedData = passedData.data;
    flattedData.map(function(d) {
        let graphElement = {}
        graphElement['name'] = moment(d.t, DATE_TIME_FORMAT).format(GRAPH_LABEL_TIME_FORMAT);
        metrics['vector'].map((vec) => {
            graphElement[vec.shortName] = d[vec.path];
            nameMapper[vec.shortName] = {};
            nameMapper[vec.shortName]['name'] = vec.name;
            nameMapper[vec.shortName]['color'] = vec.color;
        })
        graphData.push(graphElement)
    });
    return {graphData: graphData,
        nameMapper: nameMapper
    }
}