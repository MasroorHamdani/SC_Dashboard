import React, {Component} from "react";
import {withStyles} from '@material-ui/core';
import { connect } from "react-redux";
import _, {isEqual} from 'lodash';

import ProjectCreation from '../../components/ProjectCreation/ProjectCreation';
import {PROJECT_CREATION, LOCATION_LIMIT, API_URLS} from '../../constants/Constant';
import {projectCreation, projectUpdate} from  '../../actions/AdminAction';

import {formatDateTime} from '../../utils/DateFormat';
import {getApiConfig} from '../../services/ApiCofig';

import styles from './ProjectCreateStyle';


class ProjectCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: 'general',
            general: {
                site: "",
                site_addr: "",
                Region: "",
                Email: ""
            },
            location: {
                locn: "",
                name: "",
                offday: "",
                ShiftStart: "",
                ShiftEnd: "",
                Mute: false
            },
            area: {
                locn: "",
                area: ""
            },
            locations: [],
            allLocations: [],
            tempLocation: [],
            editLocation: [],
            areas: [],
            allAreas: [],
            open: false,
            openArea: false,
            showFooter: true
        }
    }

    handleChange = (event, param) => {
    /**
     * Common function to set any fields value from UI in state.
     */
        let {name, value} = event.target;
        if (name === 'Mute') {
            value = event.target.checked;
        }
        this.setState({
            [param]: {
                ...this.state[param],
                [name]: value
            }
        });
    }

    handleClick = (panel="", isDraft=false) => {
    /**
     * Post API call to save the data for a user profile.
     */
        this.setState({panel: panel}, function() {
            if(panel === 'location' && !isDraft) {
                this.getProjectData();
            } else if(panel === 'area' && !isDraft) {
                this.getProjectLocationData();
            } else if (panel === 'general' && isDraft) {
                this.getProjectData()
            } else if (panel === 'location' && isDraft) {
                this.getProjectLocationData();
            } else {
                this.setState({
                    expanded:panel,
                    generalErrorMessage: ''
                })
            }
        })
    }

    getProjectLocationData = () => {
        // Call api to save data
        if(!_.isEmpty(this.state.allLocations)) {
            let endPoint = `${API_URLS['ADMIN']}`,
            dataToPost = {};
            dataToPost['location'] = this.state.allLocations;
            dataToPost['type'] = PROJECT_CREATION['LOCATION'];
            dataToPost['pid'] = this.state.pid; //value returned from previous api call - project id
            let config = getApiConfig(endPoint, 'POST', dataToPost);
            this.props.onProjectCreation(config, 'POST');
        }
        if(!_.isEmpty(this.state.editLocation)) {
            let endPoint = `${API_URLS['ADMIN']}/${this.state.pid}`,
                dataToPost = {};
            this.state.editLocation.map((row) => {
                dataToPost = row;
                dataToPost['type'] = PROJECT_CREATION['LOCATION'];
                let config = getApiConfig(endPoint, 'POST', dataToPost);
                this.props.onProjectUpdate(config, 'POST');
            })
        }
        return true
    }

    getProjectData = () => {
        //Call aPI to save data
        if(this.state.general.site && this.state.general.site_addr &&
            this.state.general.Email && this.state.general.Region) {
            if(!isEqual(this.state.generalProject, this.state.general)) {
                let endPoint = this.state.pid ? `${API_URLS['ADMIN']}/${this.state.pid}` : `${API_URLS['ADMIN']}`,
                    EmailArray = this.state.general.Email.split(','),
                    dataToPost = {};
                dataToPost['site'] = this.state.general.site;
                dataToPost['site_addr'] = this.state.general.site_addr;
                dataToPost['Region'] = this.state.general.Region;
                dataToPost['type'] = PROJECT_CREATION['GENERAL'];
                dataToPost['HealthUpdates'] = {'Email': EmailArray};
                let config = getApiConfig(endPoint, 'POST', dataToPost);
                this.props.onProjectCreation(config, 'POST');
            } else {
                this.setState({expanded: this.state.panel})
            }
        } else {
            this.setState({generalErrorMessage : "Please enter all valid details"})
        }
    }

    editLocation = (id, dt) => {
        let location = this.state.locations[id];
        location['offday'] = location['offdays'].join();
        location['isEdit'] = true
        this.setState(
            {location: location,
            tempEdit: location}
        )
        this.handleModalState('location')
    }
    handleModalState = (panel='') => {
    /**
     * Handle the modal open and close state.
     * Modal shown to add a new allocation.
     */
        if(panel === 'location') {
            if(this.state.allLocations.length < LOCATION_LIMIT)
                this.setState({
                    errorMessage: '',
                    open: !this.state.open
                });
            else {
                this.setState({limitErrorMessage : "Please Save the Details before adding more locations"})
            }
        } else if(panel === 'area') {
            if(this.state.areas.length < LOCATION_LIMIT)
                this.setState({
                    errorAreaMessage: '',
                    openArea: !this.state.openArea
                });
            else {
                this.setState({limitAreaErrorMessage : "Please Save the Details before adding more locations"})
            }
        }
    };
    
    difference = (object, base) =>{
        function changes(object, base) {
            return _.transform(object, function(result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base)
    }
    

    onAddtion = () => {
        if (this.state.location.name && this.state.location.locn &&
            this.state.location.offday && this.state.location.ShiftEnd &&
            this.state.location.ShiftStart) {
                let dataToPost = {}, temp = {};
                // console.log(this.state.location);
                dataToPost['name'] = this.state.location.name;
                dataToPost['locn'] = this.state.location.locn;
                dataToPost['Mute'] = this.state.location.Mute;
                let offDays = this.state.location.offday.split(',')
                dataToPost['offdays'] = offDays;
                dataToPost['offtimes'] = [{
                    'End': formatDateTime(this.state.location.ShiftEnd, "hh:mm a", "HHmm"),
                    'Start': formatDateTime(this.state.location.ShiftStart, "hh:mm a", "HHmm")
                }]
                // if(this.state.location.InsID)
                // dataToPost['insid'] = this.state.location.InsID ? this.state.location.InsID : '';
                temp =  _.cloneDeep(dataToPost);
                temp['ShiftEnd'] = this.state.location.ShiftEnd;
                temp['ShiftStart'] = this.state.location.ShiftStart;
                temp['offday'] = this.state.location.offday
                // let index = this.state.locations.indexOf(this.state.tempEdit);
                let index = _.findIndex(this.state.locations, this.state.tempEdit);
                
                if(index >= 0)
                    this.state.locations.splice(index, 1);
                

                if(this.state.location.insid) {
                    dataToPost['insid'] = this.state.location.insid;
                    temp['insid'] = dataToPost['insid'];
                    let allLocTemp = this.state.tempEdit;
                    delete allLocTemp['ShiftEnd'];
                    delete allLocTemp['ShiftStart'];
                    delete allLocTemp['offday'];
                    delete allLocTemp['isEdit'];
                    console.log(this.state.tempEdit)
                    console.log(this.state.editLocation)
                    // let index = this.state.editLocation.indexOf(this.state.tempEdit);
                    let index = _.findIndex(this.state.editLocation, allLocTemp);
                    if(index >= 0)
                        this.state.editLocation.splice(index, 1);
                    this.setState({
                        editLocation: [
                            ...this.state.editLocation.concat(dataToPost)
                        ],
                        locations: [
                            ...this.state.locations.concat(temp)
                        ],
                        location: {
                            locn: "",
                            name: "",
                            offday: "",
                            ShiftStart: "",
                            ShiftEnd: "",
                            Mute: false
                        },
                        tempEdit: {}
                    }, function() {
                        console.log(this.state.locations)
                    });
                    
                } else if(this.state.location.isEdit) {
                    let allLocTemp = this.state.tempEdit;
                    delete allLocTemp['ShiftEnd'];
                    delete allLocTemp['ShiftStart'];
                    delete allLocTemp['offday'];
                    delete allLocTemp['isEdit'];

                    let tempIndex = _.findIndex(this.state.allLocations, allLocTemp);
                    // console.log(this.state.allLocations.indexOf(allLocTemp))
                    // console.log(this.state.allLocations[0], allLocTemp)
                    // console.log(_.findIndex(this.state.allLocations, allLocTemp));
                    // console.log(this.difference(this.state.allLocations[0], allLocTemp))
                    if(tempIndex >= 0)
                        this.state.allLocations.splice(tempIndex, 1);
                    
                    let index = _.findIndex(this.state.tempLocation, allLocTemp);
                    if(index >= 0)
                        this.state.tempLocation.splice(index, 1);
                    this.setState({
                        locations: [
                            ...this.state.locations.concat(temp)
                        ],
                        allLocations: [
                            ...this.state.allLocations.concat(dataToPost)
                        ],
                        tempLocation: [
                            ...this.state.tempLocation.concat(temp)
                        ],
                        location: {
                            locn: "",
                            name: "",
                            offday: "",
                            ShiftStart: "",
                            ShiftEnd: "",
                            Mute: false
                        },
                        tempEdit: {}
                    }, function() {
                        console.log(this.state.allLocations);
                    });
                }
                else {
                this.setState({
                    locations: [
                        ...this.state.locations.concat(temp)
                    ],
                    tempLocation: [
                        ...this.state.tempLocation.concat(temp)
                    ],
                    allLocations: [
                        ...this.state.allLocations.concat(dataToPost)
                    ],
                    location: {
                        locn: "",
                        name: "",
                        offday: "",
                        ShiftStart: "",
                        ShiftEnd: "",
                        Mute: false
                    }
                });
            }
            this.handleModalState('location');
        } else {
            this.setState({errorMessage : "Please enter all valid details"})
        }
    }

    onAreaAddtion = () => {
        if(this.state.area.locn) {
            let dataToPost = this.state.area;
            this.setState({
                areas: [
                    ...this.state.areas.concat(dataToPost)
                ],
                allAreas: [
                    ...this.state.allAreas.concat(dataToPost)
                ],
            }, function() {
                this.setState({area: {
                    locn: "",
                    insid: "",
                },})
            });
            this.handleModalState('area');
        } else {
            this.setState({errorAreaMessage : "Please enter all valid details"})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectData && 
            !isEqual(this.props.projectData, prevProps.projectData)) {
                if(this.props.projectData['PID'] && !this.props.projectData['location'])
                    this.setState({
                        pid : this.props.projectData['PID'],
                        expanded: this.state.panel,
                        generalProject: this.state.general
                })
                else {
                    this.state.tempLocation.map((row) => {
                        // let index = this.state.locations.indexOf(row);
                        let index = _.findIndex(this.state.locations, row)
                        if(index >= 0)
                            this.state.locations.splice(index, 1);
                    })

                    let loc = this.props.projectData['location'];
                    loc.map((row) => {
                        row['ShiftEnd'] = formatDateTime(row['offtimes'][0]['End'], "HHmm", "HH:mm")
                        row['ShiftStart'] = formatDateTime(row['offtimes'][0]['Start'], "HHmm", "HH:mm")
                        row['insid'] = row['InsID']
                    })
                    this.setState({
                        expanded: this.state.panel,
                        limitErrorMessage: '',
                        allLocations: [],
                        tempLocation: [],
                        locations: [
                            ...this.state.locations.concat(loc)
                        ],
                    })
                }
        }

        if(this.props.projectUpdate && 
            !isEqual(this.props.projectUpdate, prevProps.projectUpdate)) {
                this.setState({
                    editLocation: []
                })
                console.log(projectUpdate);
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                    <ProjectCreation onChange={this.handleChange}
                        data={this.state}
                        onClick={this.handleClick}
                        onAddtion={this.onAddtion}
                        onAreaAddtion={this.onAreaAddtion}
                        handleModalState={this.handleModalState}
                        editLocation={this.editLocation}/>
                </main>
          </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        projectData : state.AdminReducer.data,
        projectUpdate: state.AdminProjectUpdateReducer.data
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectCreation: (config) => {
            dispatch(projectCreation(config))
        },
        onProjectUpdate: (config) => {
            dispatch(projectUpdate(config))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectCreate));