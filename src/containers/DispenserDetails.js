import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEqual} from 'lodash-es';
import * as firebase from 'firebase';

import DispenserAnalysis from "../components/dataAnalysis/DispenserAnalysis";
import {API_URLS, NAMESPACE_MAPPER} from '../constants/Constant';
import {getApiConfig} from '../services/ApiCofig';
import {projectSubMenuList, dispenserData} from '../actions/DataAnalysis';
import {getVector, getStartEndTime} from '../utils/AnalyticsDataFormat';

class DispenserDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: props.match.params.pid,
            location: '',
            open: false,
            start: new Date(),
            end: new Date(),
            selectedIndex: 0
        }
    }
    onCollectionUpdate = (querySnapshot) => {
        const dispenser = [];
        querySnapshot.forEach((doc) => {
            dispenser.push(doc.data());
        });
        this.setState(
            {dispenserData: dispenser})
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    handleChangeStart  = (date) => {
        this.setState({
            start: date
        });
    }
    handleChangeEnd  = (date) => {
        this.setState({
            end: date
        });
    }
    handleDatePicker = () => {
        this.setState({
            selectedIndex: -1
        }, function () {
        this.handleDateChange('custom',
            this.state.start, this.state.end)
        })
    }
    handleListSelection = (event, text, value) => {
        this.setState({
            selectedIndex: value
        }, function () {
            this.handleDateChange(text)
        })
    }
    handleDateChange = (param='', startDate='', endDate='') => {
        let formatedDate = getStartEndTime(param, startDate, endDate)
        this.setState( {
          start: formatedDate.start,
          end: formatedDate.end,
          sessionHeader: ''
        }, function() {
          this.getNewAnalyticsData();
        })
    }
    handleSamplingChange = (event, mainPath='', path='') => {
        const {name, value} = event.target;
        if(mainPath === 'update') {
          this.getNewAnalyticsData();
        } else {
          this.setState({
            [mainPath]: {...this.state[mainPath],
              [path]: {...this.state[mainPath][path],
                [name]: value
              }
            }
          });
        }
    }
    getNewAnalyticsData = () => {
        let dataToPost = {
            "metrics": [
                {
                    "metricID": "mid1",
                    "metricName": "Times for Bad Feedbacks",
                    "metricType": "timeseries",
                    "metricDataKey": "t",
                    "dimensions": [
                        {
                            "type": "resampler",
                            "key": "v_p",
                            "statistic": "mean",
                            "window_type": "constant",
                            "window": "15T",
                            "filterop": "none",
                            "operand": 4,
                            "name": "Bad Feedbacks Times: Rating 4",
                            "showSamplingWidget": true,
                            "ctype": "area",
                            "dkey": "key",
                            "id": "did1"
                        }	
                    ]
                }
            ]
        };
        
        const endPoint = `${API_URLS['DEVICE_DATA']}/FRASER_WWY_MALL/DM178`,
        params = {
            'start' : '201902041000',//this.state.start,//'2019010100',//
            'end': '201902041230',//this.state.end,//'2019010123',//
        };
        let headers = {
            'x-sc-session-token': this.state.sessionHeader ? this.state.sessionHeader : ''
        },
        config = getApiConfig(endPoint, 'POST', dataToPost, params, headers);
        this.props.onDispenserData(config, endPoint);
    }
    handleBarClick = (key) => {
        this.setState({ open: true });
        this.handleDateChange();
    }

    componentDidMount() {
        const endPoint = `${API_URLS['PROJECT_DETAILS']}/${this.state.pid}${API_URLS['PROJECT_LOCATION']}`,
            config = getApiConfig(endPoint, 'GET');
            this.props.onProjectLocation(config);
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectLocation &&
            !isEqual(this.props.projectLocation, prevProps.projectLocation)) {
                let deviceList = this.props.projectLocation;
                deviceList.map((row) => {
                    let SUB1 = NAMESPACE_MAPPER[row['NS']].SUB1,
                    SUB2 = NAMESPACE_MAPPER[row['NS']].SUB2;
                    row[SUB2] =  row.SUB2 ? row.SUB2 : '';
                    row[SUB1] = row.SUB1 ? row.SUB1 : '';
                })
                this.setState({deviceList: deviceList})
        }
        if(this.props.dispenserData &&
            !isEqual(this.props.dispenserData, prevProps.dispenserData)) {
                let metricsData = getVector(this.props.dispenserData.data.data.allMetrics, 'DD');
                this.setState({
                    sessionHeader: this.props.dispenserData.headers['x-sc-session-token'],
                    metrics: metricsData.dataMetrics,
                    allMetrics: this.props.dispenserData.data.data.allMetrics,
                    dispenserDetails: this.props.dispenserData.data});

                Object.keys(metricsData.metric).map((key) => {
                let value = {}
                metricsData.metric[key].map((dt) => {
                    Object.keys(dt).map((d) => {
                    value[d] = {};
                    })
                })
                if(!this.state[key])
                    this.setState({[key]: value})
                })
            }
    }
    handleLocationSelectionChange = event => {
        // Either remove condition and let user select default 'Select Project' Option 
        // and make an API call with empty value
        // Or have this condotion added whcih won't user select the default empty option back.
        if(event.target.value) {
            this.setState({location: event.target.value}, function() {
                this.fbRef = firebase.firestore().collection(this.state.pid).doc(`${this.state.location}:DM`).collection('DATA');
                this.fbRef.onSnapshot(this.onCollectionUpdate);
            });
        }
    };
    render() {
        return(
            <DispenserAnalysis
                stateData={this.state}
                handleLocationSelectionChange={this.handleLocationSelectionChange}
                handleBarClick={this.handleBarClick}
                handleClose={this.handleClose}
                handleChangeStart={this.handleChangeStart}
                handleChangeEnd={this.handleChangeEnd}
                handleDatePicker={this.handleDatePicker}
                handleListSelection={this.handleListSelection}
                handleSamplingChange={this.handleSamplingChange}/>
        )
    }
}
function mapStateToProps(state) {
    return {
        projectLocation : state.DataAnalysisProjectListSubMenuReducer.data,
        dispenserData : state.DispenserDataReducer.data,
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        onProjectLocation: (config) => {
          dispatch(projectSubMenuList(config))
        },
        onDispenserData: (config) => {
            dispatch(dispenserData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DispenserDetails);