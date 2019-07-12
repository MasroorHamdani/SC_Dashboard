import React, {Component} from "react";
import {withStyles} from '@material-ui/core';
import { connect } from "react-redux";
import _, {isEqual} from 'lodash';

import ProjectCreation from '../../components/ProjectCreation/ProjectCreation';
import {PROJECT_CREATION, LOCATION_LIMIT, API_URLS} from '../../constants/Constant';
import {projectCreation} from  '../../actions/AdminAction';

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
                offdays: "",
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
            areas: [],
            allAreas: [],
            open: false,
            openArea: false
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
        let endPoint = `${API_URLS['ADMIN']}`,
        dataToPost = {};
        dataToPost['location'] = this.state.allLocations;
        dataToPost['type'] = PROJECT_CREATION['LOCATION'];
        dataToPost['pid'] = this.state.pid; //value returned from previous api call - project id
        let config = getApiConfig(endPoint, 'POST', dataToPost);
        this.props.onProjectCreation(config, 'POST');
        this.setState({allLocations: []});
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

    editLocation = (insID, dt) => {
        console.log(insID, dt)
    }
    handleModalState = (panel='') => {
    /**
     * Handle the modal open and close state.
     * Modal shown to add a new allocation.
     */
        if(panel === 'location') {
            if(this.state.locations.length < LOCATION_LIMIT)
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

    onAddtion = () => {
        if (this.state.location.name && this.state.location.locn &&
            this.state.location.offdays, this.state.location.ShiftEnd &&
            this.state.location.ShiftStart) {
            let dataToPost = {}, temp = {};
            dataToPost['name'] = this.state.location.name;
            dataToPost['locn'] = this.state.location.locn;
            dataToPost['Mute'] = this.state.location.Mute;
            let offDays = this.state.location.offdays.split(',')
            dataToPost['offdays'] = offDays;
            dataToPost['offtimes'] = [{
                'End': formatDateTime(this.state.location.ShiftEnd, "hh:mm a", "HHmm"),
                'Start': formatDateTime(this.state.location.ShiftStart, "hh:mm a", "HHmm")
            }]
            temp =  _.cloneDeep(dataToPost);
            temp['ShiftEnd'] = this.state.location.ShiftEnd;
            temp['ShiftStart'] = this.state.location.ShiftStart
            this.setState({
                locations: [
                    ...this.state.locations.concat(temp)
                ],
                allLocations: [
                    ...this.state.allLocations.concat(dataToPost)
                ],
            }, function() {
                this.setState({location: {
                    locn: "",
                    name: "",
                    offdays: "",
                    ShiftStart: "",
                    ShiftEnd: "",
                    Mute: false
                },})
            });
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
                if(this.props.projectData['pid'])
                    this.setState({
                        pid : this.props.projectData['pid'],
                        expanded: this.state.panel,
                        generalProject: this.state.general
                })
                else {
                    console.log(this.props.projectData)
                    this.setState({expanded: this.state.panel})
                }
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectCreation: (config) => {
            dispatch(projectCreation(config))
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectCreate));