import React, { Component } from 'react';
import "./../sass/App.css";

class ProjectDataComponent extends Component {
    render() {
        if(this.props.data) {
            const data = this.props.data.map((row,index) => {
                return(
                    <div key={row.key} className="box" onClick={this.props.onClick}>
                        <div>{row.key}</div>
                        <div>{row.site}</div>
                        <div>{row.site_addr}</div>
                        {/* <div>No of alerts: {row.alertNumber}</div>
                        <div>Over time: {row.alertOverTime}hr</div> */}
                    </div>
                );
            });
        return <div className="flex-container">{data}</div>
        } else {
            return <div className="flex-container">No Data</div>
        }
    }   
}
export default ProjectDataComponent;