import React, {Component} from "react";
import {withStyles, Typography, ExpansionPanel,
  ExpansionPanelSummary, ExpansionPanelDetails} from '@material-ui/core'
import ProjectGeneralInfo from './ProjectGeneralInfo';
import ProjectLocationInfo from './ProjectLocationInfo';
import ProjectAreaInfo from './ProjectAreaInfo';
import styles from './ProjectCreationStyle';

class ProjectCreation extends Component {
    constructor(props) {
      super(props)
      // this.state = {
      //   expanded: 'project'
      // }
    }
    // handleChange = (panel) => {
    //   this.setState({expanded:panel})
    // }
    render() {
      const {classes, onChange, data, onClick, onLocationAddtion,
        handleModalState, onAreaAddtion, editLocation, editArea,
        handleFileUpload, deleteObject, projectSelected} = this.props;
      return (
        <div>
          <Typography variant="h6">
            Create New Project
          </Typography>
          <ExpansionPanel expanded={data.expanded === 'general'}>
            <ExpansionPanelSummary id="panel_project">
              <Typography className={classes.heading}>Project General Details</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ProjectGeneralInfo onChange={onChange}
                data={data} onClick={onClick} projectSelected={projectSelected}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={data.expanded === 'location'}>
            <ExpansionPanelSummary id="panel_location">
              <Typography className={classes.heading}>Project Location Details</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ProjectLocationInfo onChange={onChange}
                data={data} onClick={onClick} onAddtion={onLocationAddtion}
                handleModalState={handleModalState} editLocation={editLocation}
                handleFileUpload={handleFileUpload}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={data.expanded === 'area'}>
            <ExpansionPanelSummary id="panel_area">
              <Typography className={classes.heading}>Project Area Details</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <ProjectAreaInfo onChange={onChange}
                data={data} onClick={onClick} onAddtion={onAreaAddtion}
                handleModalState={handleModalState} editArea={editArea}
                deleteObject={deleteObject}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      )
    }
}

export default withStyles(styles)(ProjectCreation);