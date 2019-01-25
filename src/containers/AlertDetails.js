import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEqual, groupBy} from 'lodash';
import moment from 'moment';

import AlertAnalysis from "../components/dataAnalysis/AlertAnalysis";
import {API_URLS, DATE_TIME_FORMAT} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {projectAlertList} from '../actions/DataAnalysis';

class AlertDetails extends Component {
    constructor(props) {
        super(props);
        let now = new Date();
        now.setHours(now.getHours()-1);
        this.state = {
            pid: props.match.params.pid,
            startDate: now,
            endDate: new Date(),
            dateChanged: false
        }
    }
    handleChangeStart  = (date) => {
        this.setState({
            startDate: date,
            dateChanged: true
          });
    }
    handleChangeEnd  = (date) => {
        this.setState({
            endDate: date,
            dateChanged: true
          });
    }
    componentDidMount() {
        this.getAlertData();
    }
    getAlertData = () => {
        const endPoint = `${API_URLS['PROJECT_ALERT']}/${this.state.pid}`,
        params = {
            'start' : moment(this.state.startDate, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT),
            'end' : moment(this.state.endDate, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT)
        },
        config = getApiConfig(endPoint, 'GET', '', params);
        this.props.onProjectAlert(config);
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectAlert &&
            !isEqual(this.props.projectAlert, prevProps.projectAlert)) {
            let finalDict = [];
            const data = groupBy(this.props.projectAlert,'ID');
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
                finalDict.push(test)
            })
            this.setState(
                {'alertData': finalDict})
        }
    }
    render() {
        return(
            <AlertAnalysis stateData={this.state}
            handleChangeStart={this.handleChangeStart}
            handleChangeEnd={this.handleChangeEnd}
            getAlertData={this.getAlertData}/>
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