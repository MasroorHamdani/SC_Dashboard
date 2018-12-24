import _ from 'lodash';
import moment from 'moment';
import {DATE_TIME_FORMAT, GRAPH_LABEL_TIME_FORMAT} from '../constants/Constant';

export function getFormatedGraphData(passedData, metrics) {
    let graphData = [], nameMapper = {},
    flattedData = _.flatMap(passedData, ({ DEVICE_ID, data }) =>
        _.map(data, dt => ({ DEVICE_ID, ...dt }))
        );
    flattedData.map(function(d) {
        let graphElement = {}
        graphElement['name'] = moment(d.t, DATE_TIME_FORMAT).format(GRAPH_LABEL_TIME_FORMAT);
        metrics['vector'].map((vec) => {
            let x = vec.path.split('.');
            if(x.length === 2)
                graphElement[vec.shortName] = d[x[0]][x[1]];
            else
                graphElement[vec.shortName] = d[x[0]];
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