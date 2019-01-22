import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEqual, groupBy} from 'lodash';
import AlertAnalysis from "../components/dataAnalysis/AlertAnalysis";
import {API_URLS} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {projectAlertList} from '../actions/DataAnalysis';

class AlertDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
        }
    }
    componentDidMount() {
        const endPoint = `${API_URLS['PROJECT_ALERT']}/${this.state.pid}`,
            params = {
                'start' : '20190116160000', //'20190116160831',//'20190116160000',
                'end' : '20190116200000' //'20190116162831'//'20190122141401'//'20190116200000'
            },
            config = getApiConfig(endPoint, 'GET', '', params);
            this.props.onProjectAlert(config);
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectAlert &&
            !isEqual(this.props.projectAlert, prevProps.projectAlert)) {
            // console.log(groupBy(this.props.projectAlert,'ID'));
            let finalDict = [];
            const data = groupBy(this.props.projectAlert,'ID');
            Object.keys(data).map((key, index) => {
                let test = {};
                test['data'] = [];
                // console.log(data[key], "bhhb");
                data[key].map((row) => {
                    if(row.SortKey.includes('status')) {
                        test['header'] = row;
                    } else {
                        test['data'].push(row);
                    }
                })
                finalDict.push(test)
            })
            this.setState(
                {'alertData': finalDict})
        }
    }
    render() {
        return(
            <AlertAnalysis data={this.state.alertData}/>
        )
    }
}
function mapStateToProps(state) {
    return {
        projectAlert : state.ProjectAlertReducer.data,
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        onProjectAlert: (config) => {
          dispatch(projectAlertList(config))
      },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AlertDetails);