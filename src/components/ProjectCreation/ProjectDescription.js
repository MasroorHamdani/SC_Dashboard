import React, {Component} from 'react';
import {withStyles, Grid, Button, Typography, Divider} from '@material-ui/core';
import {isEmpty} from 'lodash';

import ProjectGeneralInfo from './ProjectGeneralInfo';
import ProjectLocationInfo from './ProjectLocationInfo';
import ProjectAreaInfo from './ProjectAreaInfo';
import CustomModal from '../../components/modal/Modal';
import {PROJECT_STATUS} from '../../constants/Constant';

import styles from './ProjectCreationStyle';

class ProjectDescription extends Component {
    render() {
        const {classes, statedata, handleModalState,
            onClick} = this.props;
        return (<div>
            {!isEmpty(statedata.projectDetail) &&
            <div>
                <Typography variant="h6">
                    Project General Details
                </Typography>
                <ProjectGeneralInfo data={statedata.projectDetail}/>
                <Divider className={classes.divider}/>
                <Typography variant="h6">
                    Project Location Details
                </Typography>
                <ProjectLocationInfo data={statedata.projectDetail}/>
                <Divider className={classes.divider}/>
                <Typography variant="h6">
                    Project Area Details
                </Typography>
                <ProjectAreaInfo data={statedata.projectDetail}/>
                {(statedata.projectDetail.general.SUB2 !== PROJECT_STATUS['ACTIVE'] &&
                    statedata.projectDetail.general.SUB2 !== PROJECT_STATUS['REJECT']) &&
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}
                        direction='row'
                        justify='flex-end'>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={e=>handleModalState(PROJECT_STATUS['REJECT'])}>
                                Reject
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}
                        container
                        alignItems='center'
                        direction='row'
                        justify='flex-end'
                        >
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={e=>handleModalState(PROJECT_STATUS['ACTIVE'])}>
                            Accept
                        </Button>
                        </Grid> 
                    </Grid>
                }
                {/* Modal for Associating user to new location */}
                <CustomModal
                    header={statedata.modalHeader}
                    handleClose={event => handleModalState()}
                    handleClick={onClick}
                    open={statedata.open}
                    showFooter={statedata.showModalFooter}
                />
            </div>
            }
        </div>)
    }
}

export default withStyles(styles)(ProjectDescription);