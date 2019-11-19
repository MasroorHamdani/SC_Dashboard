import React, {Component} from 'react';
import {withStyles, Grid, Button, Typography, Divider} from '@material-ui/core';
import {isEmpty} from 'lodash';

import ProjectGeneralInfo from './ProjectGeneralInfo';
import ProjectLocationInfo from './ProjectLocationInfo';
import ProjectAreaInfo from './ProjectAreaInfo';
import CustomModal from '../../components/modal/Modal';
import {PROJECT_STATUS, ROLES} from '../../constants/Constant';

import styles from './ProjectCreationStyle';

class ProjectDescription extends Component {
    render() {
        const {classes, statedata, handleModalState,
            onClick, handleEdit} = this.props;
        return (<div className={classes.containerPadding}>
            {!isEmpty(statedata.projectDetail) &&
            <Grid container>
                {statedata.projectDetail &&
                    <Grid item
                        // xs={true}
                    >
                        <Typography variant="h6">
                            Project General Details
                        </Typography>
                        <ProjectGeneralInfo data={statedata.projectDetail}/>
                        <Divider className={classes.divider}/>
                    </Grid>
                }
                { !isEmpty(statedata.projectDetail.locations) &&
                    <Grid item
                        xs={true}
                        >
                        <Typography variant="h6">
                            Project Location Details
                        </Typography>
                        <ProjectLocationInfo data={statedata.projectDetail}/>
                        <Divider className={classes.divider}/>
                    </Grid>
                }
                { !isEmpty(statedata.projectDetail.area) &&
                    <Grid item
                        xs={true}
                        >
                        <Typography variant="h6">
                            Project Area Details
                        </Typography>
                        <ProjectAreaInfo data={statedata.projectDetail}/>
                    </Grid>
                }
                {statedata.projectDetail.general.SUB2 === PROJECT_STATUS['DRAFT'] ?
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.floatingRightButton}
                        onClick={e=>handleEdit(PROJECT_STATUS['DRAFT'])}>
                        Edit
                    </Button>
                :
                (statedata.projectDetail.general.SUB2 !== PROJECT_STATUS['ACTIVE'] &&
                    statedata.projectDetail.general.SUB2 !== PROJECT_STATUS['REJECT'] &&
                    statedata.role === ROLES['SC_ADMIN']) &&
                    <Grid container spacing={24}>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.floatingLeftButton}
                            onClick={e=>handleModalState(PROJECT_STATUS['REJECT'])}>
                            Reject
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.floatingRightButton}
                            onClick={e=>handleModalState(PROJECT_STATUS['ACTIVE'])}>
                            Accept
                        </Button>
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
            </Grid>
            }
        </div>)
    }
}

export default withStyles(styles)(ProjectDescription);