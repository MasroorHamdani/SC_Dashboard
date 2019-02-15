import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import styles from './ProjectDataStyle';
import DataCard from './DataCard';

class ProjectDataComponent extends Component {
    render() {
        const { stateData, onClick,
            projectActionRedirection } = this.props;
            if(stateData.dashboardData){
            const returnData = stateData.dashboardData.map((row, index) => {
                return <DataCard key={index} onClick={onClick} row={row}
                    projectActionRedirection={projectActionRedirection} stateData={stateData}/>
            });
            return (
                <div className="flex-container">{returnData}</div>
            );
        } else {
            return <div className="flex-container">No Data</div>
        }
    }   
}
ProjectDataComponent.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ProjectDataComponent);