import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEqual, groupBy} from 'lodash';

import AlertAnalysis from "../components/dataAnalysis/AlertAnalysis";
import {API_URLS, DATE_TIME_FORMAT, NAMESPACE_MAPPER} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {projectAlertList} from '../actions/DataAnalysis';
import {projectSubMenuList} from '../actions/DataAnalysis';
import {formatDateWithTimeZone} from '../utils/DateFormat';

class AlertDetails extends Component {
    constructor(props) {
        super(props);
        let now = new Date();
        now.setHours(now.getHours()-12);
        this.state = {
            pid: props.match.params.pid,
            startDate: now,
            endDate: new Date(),
            dateChanged: false,
            loading: true,
            success: false,
            insid:''
        }
        this.info = false;
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
    setStateValue = (event) => {
        let {name, value} = event.target;
        this.setState({[name]: value})
    }
    getInstallationLocation =()=> {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['WASHROOM_LOCATION']}`,
            config = getApiConfig(endPoint, 'GET');
        this.props.onDataAnalysisMenu(config);
    }
    componentDidMount() {
        this.getInstallationLocation()
        this.getAlertData();
    }
    getAlertData = () => {
        this.setState({
            loading: true,
            success: false,
        },function() {
            let endPoint,
                timeZone = localStorage.getItem(this.state.pid);
            if(!this.state.insid) {
                endPoint = `${API_URLS['PROJECT_ALERT']}/${this.state.pid}`;
            }
            else {
                endPoint = `${API_URLS['PROJECT_ALERT']}/${this.state.pid}${API_URLS['INSTALLATION']}/${this.state.insid}`;
                this.showFilter = true;
            }
            let params = {
                'start' : formatDateWithTimeZone(this.state.startDate, DATE_TIME_FORMAT, DATE_TIME_FORMAT, timeZone),
                'end' : formatDateWithTimeZone(this.state.endDate, DATE_TIME_FORMAT, DATE_TIME_FORMAT, timeZone)
            },
            config = getApiConfig(endPoint, 'GET', '', params);
            this.props.onProjectAlert(config);
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectSelected && 
            !isEqual(this.props.projectSelected, prevProps.projectSelected)){
            if(this.state.pid !== this.props.projectSelected.pid)
                this.setState({
                    pid: this.props.projectSelected.pid,
                    insid: ''
                }, function() {
                        this.props.history.push(this.props.projectSelected.pid);
                        this.getInstallationLocation()
                        this.getAlertData();
                })
        }
        if((this.props.projectAlert || this.props.projectLocationList) &&
            !isEqual(this.props.projectAlert, prevProps.projectAlert)) {
            let finalDict = [], data;
            if(this.props.projectAlert)
                data = groupBy(this.props.projectAlert,'ID');
            let SUB1, SUB2;
            if(this.props.projectLocationList) {
                let deviceResponse = this.props.projectLocationList;
                deviceResponse.map((row) => {
                    SUB1 = NAMESPACE_MAPPER[row['NS']].SUB1;
                    SUB2 = NAMESPACE_MAPPER[row['NS']].SUB2;
                    row[SUB1] =  row.SUB1;
                    row[SUB2] = row.SUB2;
                })
                if(data) {
                    Object.keys(data).map((key) => {
                        let test = {};
                        test['data'] = [];
                        data[key].map((row) => {
                            deviceResponse.map((dt) => {
                                if(dt.insid === row.InstallationID) {
                                    row.name = dt.name;
                                    row.locn = dt.locn;
                                }
                            })
                            if(row.SortKey.includes('status')) {
                                test['header'] = row;
                            } else {
                                test['data'].push(row);
                            }
                        })
                        finalDict.push(test)
                    })
                    this.showFilter = true;
                }
                this.setState({'locationList': deviceResponse,
                    'alertData': finalDict})
            }
        }
        
        if(this.state.loading) {
            this.setState({
              loading: false,
              success: true,
            })
        }
    }
    render() {
        return(
            <AlertAnalysis stateData={this.state}
            handleChangeStart={this.handleChangeStart}
            handleChangeEnd={this.handleChangeEnd}
            getAlertData={this.getAlertData}
            setStateValue={this.setStateValue}
            showDate={true}
            showFilter={this.showFilter}/>
            
        )
    }
}
function mapStateToProps(state) {
    return {
        projectAlert : state.ProjectAlertReducer.data,
        projectLocationList : state.DataAnalysisProjectListSubMenuReducer.data,
        projectSelected : state.projectSelectReducer.data,
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        onProjectAlert: (config) => {
          dispatch(projectAlertList(config))
        },
        onDataAnalysisMenu: (config) => {
            //will dispatch the async action
              dispatch(projectSubMenuList(config))
          },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AlertDetails);