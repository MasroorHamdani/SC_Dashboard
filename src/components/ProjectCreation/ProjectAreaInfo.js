import React, {Component} from "react";
import {withStyles, Grid, TextField, Button,
    Card, IconButton, CardHeader, FormControl,
    Typography, InputLabel, Select, GridList} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';

import CustomModal from '../../components/modal/Modal';

import styles from './ProjectCreationStyle';

class ProjectAreaInfo extends Component {
    constructor(props) {
      super(props)
      this.state = {
        // expanded: 'project'
      }
    }

    render() {
      const {classes, data, onChange, onClick,
        onAddtion, handleModalState} = this.props;
      let returnData = <div>
          <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="age-native-helper">Location</InputLabel>
                  <Select native
                      value={data.area.insid}
                      onChange={e=>onChange(e, 'area')}
                      inputProps={{
                          name: 'insid',
                          id: 'insid',
                        }}>
                    <option value="" />
                    {data.locations.map(function(loc) {
                        return <option value={loc.name} name={loc.name} key={loc.name} >
                            {loc.name} | {loc.locn}</option>
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                  <TextField
                      required
                      id="locn"
                      name="locn"
                      label="Washroom Location"
                      fullWidth
                      autoComplete="Washroom Location"
                      value={data.area.locn}
                      onChange={e=>onChange(e, 'area')}/>
              </Grid>
              {data.errorAreaMessage &&
                  <Grid item
                      xs={24} sm={12}>
                      <Typography
                          variant="contained"
                          color="secondary">
                          {data.errorAreaMessage}
                      </Typography>
                  </Grid>
              }
          </Grid>
      </div>
      return (
        <div className={classes.gridRoot}>
          <Grid spacing={24} className={classes.grid}>
            <Grid item xs={24} sm={12}
                container
                alignItems='right'
                direction='row'
                justify='flex-end'>
                <IconButton>
                    <AddCircleOutlineIcon 
                        onClick={event => handleModalState('area')}
                    />
                </IconButton>
            </Grid>
          </Grid>
          <GridList cellHeight={250} className={classes.gridList}>
            {data.areas &&
                data.areas.map((dt, i) => {
                // Display the Added locations for the project
                // With Edit and Delete options for the selections.
                return <Card className={classes.card} key={i}>
                  <CardHeader
                    action={
                    <IconButton className={classes.iconButton}>
                        <EditIcon 
                        // onClick={event => this.editLocation(dt.InsID, dt.name)}
                        />
                        {/* <ClearIcon onClick={event => this.removeLocation(dt.InsID, dt.name)}/> */}
                    </IconButton>
                    }
                    title={dt.locn}/>
                  </Card>
                })
            }
          </GridList>
          {data.limitAreaErrorMessage &&
            <Grid 
              item
              xs={24} sm={12}>
              <Typography
                  color="secondary">
                  {data.limitAreaErrorMessage}
              </Typography>
            </Grid>
          }
          <Grid container spacing={24}>
            <Grid item xs={6} sm={3}
              direction='row'
              justify='flex-start'>
              <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={e=>onClick('area', true)}
                  >
                  Draft
              </Button>
            </Grid>
            <Grid item xs={16} sm={8}
                container
                direction='row'
                justify='flex-end'>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={e=>onClick('location')}>
                    Previous
                </Button>
            </Grid>
            <Grid item xs={2} sm={1}
                container
                direction='row'
                justify='flex-end'>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={e=>onClick()}>
                    Submit
                </Button>
            </Grid>
          </Grid>
          {/* Modal for Associating Location to Areas */}
          <CustomModal
              header="Add Area Details"
              content={returnData}
              handleClose={event => handleModalState('area')}
              handleClick={onAddtion}
              open={data.openArea}
              showFooter={true}/>
        </div>
      )
  }
}

export default withStyles(styles)(ProjectAreaInfo);