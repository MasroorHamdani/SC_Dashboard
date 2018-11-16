import React, { Component } from 'react';
import "./App.css";

// class ProjectDataComponent extends Component {
//     render() {
//         const {data} = this.props;
//         return(
//             <div className="box">
//                 <div>{data.clientName}</div>
//                 <div>{data.ClientLocation}</div>
//                 <div>No of alerts: {data.alertNumber}</div>
//                 <div>Over time: {data.alertOverTime}hr</div>
//             </div>
//         );
//     }
// }
// const ProjectDataComponent = props => {
//     const data = props.data.map((row,index) => {
//         return(
//             <div key={index} className="box">
//                 <div>{row.clientName}</div>
//                 <div>{row.ClientLocation}</div>
//                 <div>No of alerts: {row.alertNumber}</div>
//                 <div>Over time: {row.alertOverTime}hr</div>
//             </div>
//         );
//     });
//     return <div>{data}</div>
// }

class ProjectDataComponent extends Component {
    render() {
        if(this.props.data.length) {
            const data = this.props.data.map((row,index) => {
                return(
                    <div key={index} className="box">
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