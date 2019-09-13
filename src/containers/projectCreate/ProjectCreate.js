import React, {Component} from "react";
import {withStyles} from '@material-ui/core';
import { connect } from "react-redux";
import _, {isEqual} from 'lodash';
// import S3FileUpload from 'react-s3';

import configureAWS from '../../services/AWSService';
import { fabric } from 'fabric';
import mapImg from '../../images/DEMO_PROJECT_LOCN1.jpeg';

import ProjectCreation from '../../components/projectCreation/ProjectCreation';
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
                insid: ""
            },
            locations: [],
            allLocations: [],
            tempLocation: [],
            editLocation: [],
            tempEdit: {},
            areas: [],
            allAreas: [],
            open: false,
            tempArea: [],
            editArea: [],
            tempEditArea: {},
            openArea: false,
            showFooter: true,
            dimensions: {}
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
        if (param === 'area' && name === 'insid') {
            this.getImage();
        }
    }

    getImage = () => {
        let img = new Image(),
            canvas = new fabric.Canvas('canvas', {});
        img.src = mapImg;
        img.onload = () => {
            this.setState({
                dimensions:{
                    height:img.height,
                    width:img.width
                }
            }, function() {
                canvas = this.setCanvas(canvas);
            });
        }
    }

    setCanvas = (canvas) => {
        canvas.setBackgroundImage(mapImg, canvas.renderAll.bind(canvas));
        canvas.selectionColor = 'rgba(0,255,0,0.3)';
        canvas.selectionBorderColor = 'red';
        canvas.selectionLineWidth = 1;

        let tlx, tly, brx, bry, pointX, pointY;
        canvas.on('mouse:down', function(options) {
            tlx = options.e.clientX;
            tly = options.e.clientY;
            pointX = canvas.getPointer(options.e)['x']
            pointY = canvas.getPointer(options.e)['y']
        });

        canvas.on('mouse:up', function(options) {
            brx = options.e.clientX;
            bry = options.e.clientY;
            let width = Math.abs(+tlx - +brx),
            height = Math.abs(+tly - +bry);
            if(!canvas.getActiveObject()) {
                var rect = new fabric.Rect({
                    left: pointX,//+tlx,
                    top: pointY,//+tly,
                    width: width,
                    height: height,
                    fill: 'rgba(0,255,0,0.3)',
                    originX: "left",
                    originY: "top",
                    perPixelTargetFind: false,
                    hasRotatingPoint: false
                });
                canvas.add(rect)
            }
        });

        window.deleteObject = function() {
            console.log('delete')
            if(canvas.getActiveObject()) {
                canvas.remove(canvas.getActiveObject());
            }
        }
        return canvas;
    }
    handleClick = (panel="", isDraft=false) => {
    /**
     * Post API call to save the data for a user profile.
     */
        this.setState({panel: panel}, function() {
            if((panel === 'location' && !isDraft) || (panel === 'general' && isDraft)) {
                this.getProjectData();
            } else if((panel === 'area' && !isDraft) || (panel === 'location' && isDraft)) {
                this.getProjectLocationData(isDraft);
            } else if(panel === 'submit' || panel === 'area' && isDraft) {
                this.getProjectAreaData(isDraft)
            }
            else {
                this.setState({
                    expanded:panel,
                    generalErrorMessage: ''
                })
            }
        })
    }

    getProjectAreaData = (isDraft=false) => {
        if(!_.isEmpty(this.state.allAreas)) {
            let endPoint = `${API_URLS['ADMIN']}`,
            dataToPost = {};
            dataToPost['area'] = this.state.allAreas;
            dataToPost['type'] = PROJECT_CREATION['AREA'];
            dataToPost['pid'] = this.state.pid; //value returned from previous api call - project id
            dataToPost['insid'] = this.state.areas[0].insid;
            let config = getApiConfig(endPoint, 'POST', dataToPost);
            this.props.onProjectCreation(config, 'POST');
        }
        if(!_.isEmpty(this.state.editArea)) {
            let endPoint = `${API_URLS['ADMIN']}/${this.state.pid}`,
                dataToPost = {};
            this.state.editArea.map((row) => {
                dataToPost = row;
                dataToPost['type'] = PROJECT_CREATION['AREA'];
                let config = getApiConfig(endPoint, 'POST', dataToPost);
                this.props.onProjectUpdate(config, 'POST');
            })
        }
        if (!isDraft && !_.isEmpty(this.state.areas)) {
            this.setState({expanded: this.state.panel})
        }
        // return true
    }

    getProjectLocationData = (isDraft=false) => {
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
        if (!isDraft && !_.isEmpty(this.state.locations)) {
            this.setState({expanded: this.state.panel})
        }
        // return true
    }

    getProjectData = () => {
        //Call API to save data
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

    editLocation = (id) => {
        let location = this.state.locations[id];
        location['offday'] = location['offdays'].join();
        location['isEdit'] = true
        this.setState(
            {location: location,
            tempEdit: location},
            function() {
                this.handleModalState('location')
            }
        )
    }

    editArea = (id) => {
        let area = this.state.areas[id];
        area['isEdit'] = true
        this.setState(
            {area: area,
            tempEditArea: area}
        )
        this.handleModalState('area')
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
                    location: this.state.open ?
                        {
                            locn: "",
                            name: "",
                            offday: "",
                            ShiftStart: "",
                            ShiftEnd: "",
                            Mute: false
                        }: this.state.location,
                    open: !this.state.open,
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

    onLocationAddtion = () => {
        if (this.state.location.name && this.state.location.locn &&
            this.state.location.offday && this.state.location.ShiftEnd &&
            this.state.location.ShiftStart) {
                let dataToPost = {}, temp = {};
                dataToPost['name'] = this.state.location.name;
                dataToPost['locn'] = this.state.location.locn;
                dataToPost['Mute'] = this.state.location.Mute;
                dataToPost['fileUrl'] = this.state.location.file ? this.state.location.file[0].name: this.state.location.fileUrl ? this.state.location.fileUrl : null;
                let offDays = this.state.location.offday.split(',')
                dataToPost['offdays'] = offDays;
                dataToPost['offtimes'] = [{
                    'End': formatDateTime(this.state.location.ShiftEnd, "hh:mm a", "HHmm"),
                    'Start': formatDateTime(this.state.location.ShiftStart, "hh:mm a", "HHmm")
                }]

                temp =  _.cloneDeep(dataToPost);
                temp['ShiftEnd'] = this.state.location.ShiftEnd;
                temp['ShiftStart'] = this.state.location.ShiftStart;
                temp['offday'] = this.state.location.offday;
                temp['file'] = this.state.location.file ? this.state.location.file: null;
                let index = -1;
                if (!_.isEmpty(this.state.tempEdit))
                    index = _.findIndex(this.state.locations, this.state.tempEdit);
                
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
                    delete allLocTemp['file'];

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
                    });
                } else if(this.state.location.isEdit) {
                    let allLocTemp = this.state.tempEdit;
                    delete allLocTemp['ShiftEnd'];
                    delete allLocTemp['ShiftStart'];
                    delete allLocTemp['offday'];
                    delete allLocTemp['isEdit'];
                    delete allLocTemp['file'];

                    let tempIndex = _.findIndex(this.state.allLocations, allLocTemp);
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
            this.submitFile();
            this.handleModalState('location');
        } else {
            this.setState({errorMessage : "Please enter all valid details"})
        }
    }

    onAreaAddtion = () => {
        // Fix the Area Edit part (insid one)
        if(this.state.area.locn && this.state.area.insid) {
            let dataToPost = {}, temp = {};
            dataToPost['locn'] = this.state.area.locn;
            temp =  _.cloneDeep(dataToPost);
            temp['insid'] = this.state.area.insid;
            // delete temp['isEdit'];
            // delete dataToPost['isEdit'];
            let index = -1;
            if (!_.isEmpty(this.state.tempEditArea))
                index = _.findIndex(this.state.areas, this.state.tempEditArea);
            
            if(index >= 0)
                this.state.areas.splice(index, 1);
            if(this.state.area.areaid) {
                dataToPost['areaid'] = this.state.area.areaid;
                temp['areaid'] = dataToPost['areaid'];
                let allAreaTemp = this.state.tempEditArea;
                delete allAreaTemp['isEdit'];
                let index = _.findIndex(this.state.editArea, allAreaTemp);
                if(index >= 0)
                    this.state.editArea.splice(index, 1);
                this.setState({
                    editArea: [
                        ...this.state.editArea.concat(dataToPost)
                    ],
                    areas: [
                        ...this.state.areas.concat(temp)
                    ],
                    area: {
                        locn: "",
                        insid: ""
                    },
                    tempEditArea: {}
                });
            } else if(this.state.area.isEdit) {
                let allAreaTemp = _.clone(this.state.tempEditArea);
                delete allAreaTemp['isEdit'];
                delete allAreaTemp['insid'];

                let tempIndex = _.findIndex(this.state.allAreas, allAreaTemp);
                if(tempIndex >= 0)
                    this.state.allAreas.splice(tempIndex, 1);
                
                let index = _.findIndex(this.state.tempArea, allAreaTemp);
                if(index >= 0)
                    this.state.tempArea.splice(index, 1);
                this.setState({
                    areas: [
                        ...this.state.areas.concat(temp)
                    ],
                    allAreas: [
                        ...this.state.allAreas.concat(dataToPost)//dataToPost)
                    ],
                    tempArea: [
                        ...this.state.tempArea.concat(temp)
                    ],
                    area: {
                        locn: "",
                        insid: ""
                    },
                    tempEditArea: {}
                });
            } else {
                this.setState({
                    areas: [
                        ...this.state.areas.concat(temp)
                    ],
                    tempArea: [
                        ...this.state.tempArea.concat(temp)
                    ],
                    allAreas: [
                        ...this.state.allAreas.concat(dataToPost)
                    ],
                    area: {
                        locn: "",
                        insid: ""
                    }
                })
            }
            this.handleModalState('area');
            
        } else {
            this.setState({errorAreaMessage : "Please enter all valid details"})
        }
    }

    handleFileUpload = (event) => {
        this.setState({file: event.target.files,
                imageUploaded: false,
                'location': {
                    ...this.state.location,
                    file: event.target.files
                }
        });
    }

    submitFile = () => {
        if(this.state.location.file && !this.state.imageUploaded) {
            let self = this;
            let s3 = configureAWS()
            let file = this.state.file[0];

            var fileName = file.name;
            let albumName = `${this.state.pid}/mapview/`

            var photoKey = `${albumName}${fileName}`
            s3.upload({
                Key: photoKey,
                Body: file,
                ACL: 'public-read',
            }, function(err, response) {
                if (err) {
                    return self.setState({imageError: "There was an error uploading your photo"})
                }
                self.setState({
                    imageUploaded: true
                })
                return
            });
            // const config = configureAWS()
            // S3FileUpload
            // .uploadFile(file, config)
            // .then(data => console.log(data))
            // .catch(err => console.error(err))
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.projectData && 
            !isEqual(this.props.projectData, prevProps.projectData)) {
            if(this.props.projectData['PID'] && this.props.projectData['type'] === PROJECT_CREATION['GENERAL']){
            // !this.props.projectData['location'] && !this.props.projectData['area']) {
                this.setState({
                    pid : this.props.projectData['PID'],
                    expanded: this.state.panel,
                    generalProject: this.state.general
                })
            } else if(this.props.projectData['PID'] && this.props.projectData['type'] === PROJECT_CREATION['LOCATION']) {
                this.state.tempLocation.map((row) => {
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
            } else if(this.props.projectData['PID'] && this.props.projectData['type'] === PROJECT_CREATION['AREA']) {
                this.state.tempArea.map((row) => {
                    let index = _.findIndex(this.state.areas, row)
                    if(index >= 0)
                        this.state.areas.splice(index, 1);
                })
                let area = this.props.projectData['area'];
                area.map((row) => {
                    row['insid'] = row['insid']
                })
                this.setState({
                    expanded: this.state.panel,
                    limitErrorMessage: '',
                    allAreas: [],
                    tempArea: [],
                    areas: [
                        ...this.state.areas.concat(area)
                    ],
                })
            }
        }

        if(this.props.projectUpdate && 
            !isEqual(this.props.projectUpdate, prevProps.projectUpdate)) {
            console.log(this.props.projectUpdate, "this.props.projectUpdate")
            this.setState({
                editLocation: [],
                editArea: []
            })
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
                        onLocationAddtion={this.onLocationAddtion}
                        onAreaAddtion={this.onAreaAddtion}
                        handleModalState={this.handleModalState}
                        editLocation={this.editLocation}
                        editArea={this.editArea}
                        handleFileUpload={this.handleFileUpload}
                        deleteObject={window.deleteObject}/>
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