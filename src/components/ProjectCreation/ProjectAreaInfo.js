import React, {Component} from "react";
import {withStyles, Grid, TextField, Button,
    Card, IconButton, CardHeader, FormControl,
    Typography, InputLabel, Select, GridList,
    CardContent} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';

import { fabric } from 'fabric';
import mapImg from '../../images/DEMO_PROJECT_LOCN1.jpeg';

import {SORTING, AREA_LIST} from '../../constants/Constant';
import CustomModal from '../modal/Modal';
import EnhancedTable from '../grid/Grid';

import styles from './ProjectCreationStyle';

class ProjectAreaInfo extends Component {
    constructor(props) {
      super(props)
      this.state = {
        order: SORTING['DECENDING'],
        orderBy: 'locn',
        selected: [],
        page: 0,
        rowsPerPage: 5,
      }
    }

    handleChange = (name, value) => {
    /**
     * Generic function to set the state in case of any change in any of the fields
     */
        this.setState({
            [name] : value
        });
    }

    render() {
      const {classes, data, onChange, onClick,
        onAddtion, handleModalState, editArea,
        deleteObject} = this.props;
      let {width, height} = data.dimensions;

      width = width ? width.toString(): "";//"504";
      height = height? height.toString(): "";//"777";
      let returnData = <div>
        {data.showFooter &&
          <Grid container spacing={16}>
              {data.dimensions.width &&
                <Grid>
                  <Grid container item xs={10}>
                    <canvas id="canvas"
                        width={width}
                        height={height}>
                      </canvas>
                  </Grid>
                  <Grid container item xs={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={deleteObject}
                      >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              }
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel htmlFor="age-native-helper">Area List</InputLabel>
                    <Select native
                        value={data.area.area_type}
                        onChange={e=>onChange(e, 'area')}
                        inputProps={{
                            name: 'area_type',
                            id: 'area_type',
                            }}>
                    <option value="" />
                        {AREA_LIST.map(function(area) {
                            return <option value={area.color} name={area.key} key={area.key} >
                                {area.display}</option>
                    })}
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} fullWidth>
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
                        return <option value={loc.insid} name={loc.insid} key={loc.insid} >
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
        }
      </div>;
      let rows = [{ id: 'AreaId', numeric: 'left', disablePadding: false, label: 'AreaId' },
        { id: 'locn', numeric: 'left', disablePadding: false, label: 'Location' },
        ],
      tabData = <Typography component="div">
        {!data.showFooter &&
            <EnhancedTable data={data.area} rows={rows}
                order={this.state.order}
                orderBy={this.state.orderBy}
                rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                selected={this.state.selected}
                handleChange={this.handleChange}
                category='area'
                redirectID="AreaId"/>
        }
        </Typography>
      return (
        <div className={classes.gridRoot}>
          {data.showFooter ?
            <div>
              <Grid spacing={16} container className={classes.grid}>
                <Grid item xs={12} sm={12}
                    container
                    alignItems='flex-end'//'right'
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
                            onClick={event => editArea(i)}
                            />
                            {/* <ClearIcon onClick={event => this.removeLocation(dt.InsID, dt.name)}/> */}
                        </IconButton>
                        }
                        title={dt.locn}/>
                        <CardContent>
                          <Typography component="p">
                            <b>Installation :</b> {dt.locDisp}
                          </Typography>
                        </CardContent>
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
                  // direction='row'
                  // justify='flex-start'
                  >
                  <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={e=>onClick('area', true)}
                      >
                      Draft
                  </Button>
                </Grid>
                <Grid item xs={12} sm={8}
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
                        onClick={e=>onClick('submit')}>
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
          :
          <div>{tabData}</div>
        }
        </div>
      )
  }
}

export default withStyles(styles)(ProjectAreaInfo);